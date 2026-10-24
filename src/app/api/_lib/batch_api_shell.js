// src/app/api/_lib/batchApiShell.js
import {NextResponse} from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentFormattedDate } from '@/utils/dateFormatter';
import { cleanMarkForStore } from '@/utils/mediaMarks';
import { invalidateListCache } from '@/app/api/_lib/list_cache';

/**
 * Shared Mongo client.
 *
 * The batch shell used to build (and connect) a fresh client on EVERY request,
 * so each manager batch-save paid the cluster's TLS handshake again (~1.4 s)
 * and left another connection pool behind. One shared client now serves every
 * handler (see _lib/mongo.js).
 */
async function sharedCollection(collectionName) {
  const { getCollection } = await import('@/app/api/_lib/mongo');
  return getCollection(collectionName);
}

export function createBatchApiHandler(config) {
  const CONF = {
    collectionName: '',
    requiredFields: [],
    uniqueFields: [],
    validFields: [],
    arrayFields: [],
    jsonFields: [],
    enableSoftDelete: false,
    beforeBatchUpdate: null,
    afterBatchUpdate: null,
    customValidation: null,
    transformResponse: null,
    ...config
  };
  if (!CONF.collectionName) throw new Error('collectionName is required');

  /* ---------- store picker ---------- */
  const store = {
    async mongo() {
      // Shared client — never closed here, the process owns it.
      return sharedCollection(CONF.collectionName);
    },
    d1(req) {
      const env = (req.env || process.env);
      if (!env.DB) throw new Error('D1 binding "DB" not found');
      return env.DB;
    },
    async get(req) {
      if (req.env?.DB) return { type: 'd1', db: this.d1(req) };
      return { type: 'mongo', db: await this.mongo() };
    }
  };

  /* ---------- helpers ---------- */
  function sanitize(data) {
    const out = {};
    Object.entries(data).forEach(([k, v]) => {
      if (!CONF.validFields.includes(k)) return;
      if (CONF.jsonFields.includes(k)) {
        // JSON object field (e.g. order) — keep objects as-is, never stringify.
        if (v !== undefined && v !== null && v !== '') out[k] = v;
      }
      else if (CONF.arrayFields.includes(k)) out[k] = Array.isArray(v) ? v.map(item => (item !== null && typeof item === 'object' ? item : String(item))) : [];
      else if (k === 'order') {
        if (v !== undefined && v !== null && v !== '') out[k] = String(v);
      } else out[k] = v;
    });
    // `mark` is JSON now — normalise scalar form values into { value, hide }.
    if (CONF.jsonFields.includes('mark') && 'mark' in out) out.mark = cleanMarkForStore(out.mark, null);
    if (!out.updatedAt && CONF.validFields.includes('updatedAt')) out.updatedAt = getCurrentFormattedDate();
    return out;
  }
  function mapId(doc) {
    if (!doc) return doc;
    const res = { ...doc };
    if (res._id) {
      res.id = res._id.toString();
      delete res._id;
    }
    return res;
  }

  /* ---------- Batch PUT (update many) ---------- */
  async function PUT(req) {
    try {
      const { type, db } = await store.get(req);
      const body = await req.json();
      let items = Array.isArray(body) ? body : body.data || body[CONF.collectionName.toLowerCase()];
      if (!Array.isArray(items)) return NextResponse.json({ error: 'Expected array' }, { status: 400 });
      if (CONF.beforeBatchUpdate) items = await CONF.beforeBatchUpdate(items);

      const errors = [];
      const updates = [];

      for (const item of items) {
        if (!item.id) {
          errors.push({ item, error: 'Missing id field' });
          continue;
        }
        const { id, ...raw } = item;
        const upd = sanitize(raw);
        if (CONF.requiredFields.length) {
          const miss = CONF.requiredFields.filter(f => !upd[f]);
          if (miss.length) {
            errors.push({ id, error: 'Missing required fields', fields: miss });
            continue;
          }
        }
        if (CONF.customValidation) {
          const cv = await CONF.customValidation(upd, 'update');
          if (!cv.valid) {
            errors.push({ id, error: cv.error || 'Validation failed' });
            continue;
          }
        }
        // unique checks (D1 & mongo)
        if (CONF.uniqueFields.length) {
          for (const f of CONF.uniqueFields) {
            if (upd[f] === undefined) continue;
            if (type === 'd1') {
              const { results } = await db.prepare(`SELECT 1 FROM ${CONF.collectionName} WHERE ${f}=? AND id<>? LIMIT 1`)
                .bind(upd[f], id).all();
              if (results.length) {
                errors.push({ id, error: `${f} already exists`, field: f });
                break;
              }
            } else {
              const col = db;
              const existing = await col.findOne({ [f]: upd[f], _id: { $ne: new ObjectId(id) } });
              if (existing) {
                errors.push({ id, error: `${f} already exists`, field: f });
                break;
              }
            }
          }
          if (errors.some(e => e.id === id)) continue;
        }
        updates.push({ id, upd });
      }

      const ops = updates.map(({ id, upd }) =>
        type === 'd1'
          ? db.prepare(`UPDATE ${CONF.collectionName} SET ${Object.keys(upd).map(k => `${k}=?`).join(',')} WHERE id=?`)
              .bind(...Object.values(upd), id)
          : (async () => {
              const col = db;
              // Explicitly exclude _id from the update payload (same as api_id_shell.js)
              const { _id, ...finalUpd } = upd;
              const res = await col.updateOne({ _id: new ObjectId(id) }, { $set: finalUpd });
              return { meta: { changes: res.modifiedCount } };
            })()
      );
      const results = await Promise.all(ops);
      const success = results.filter(r => (r.meta?.changes || r.changes) > 0).length;
      if (CONF.afterBatchUpdate) await CONF.afterBatchUpdate(results);

      // A batch write makes every cached list of this collection stale.
      invalidateListCache(CONF.collectionName);

      const resp = { message: 'Batch update completed', success, total: updates.length, failed: errors.length };
      if (errors.length) resp.errors = errors;
      return NextResponse.json(resp);
    } catch (e) {
      console.log('Batch update error:', e);
      return NextResponse.json({ error: 'Failed to perform batch update', details: e.message }, { status: 500 });
    }
  }

  /* ---------- GET (health-check) ---------- */
  async function GET() {
    return NextResponse.json({
      message: `Batch update endpoint for ${CONF.collectionName}`,
      method: 'PUT',
      expectedBody: `{ "data": [{ "id": "...", "field1": "..." }, ...] }`
    });
  }

  return { GET, PUT };
}

/* ------------------------------------------------------------------ */
/* Full batch handler (adds POST batch-create + DELETE batch-delete)  */
/* ------------------------------------------------------------------ */
export function createFullBatchApiHandler(config) {
  const { GET, PUT } = createBatchApiHandler(config);
  const CONF = {
    collectionName: '',
    requiredFields: [],
    uniqueFields: [],
    validFields: [],
    arrayFields: [],
    jsonFields: [],
    enableSoftDelete: false,
    beforeBatchCreate: null,
    afterBatchCreate: null,
    beforeBatchDelete: null,
    afterBatchDelete: null,
    customValidation: null,
    transformResponse: null,
    ...config
  };

  const store = {
    async mongo() {
      // Shared client — never closed here, the process owns it.
      return sharedCollection(CONF.collectionName);
    },
    d1(req) {
      const env = (req.env || process.env);
      if (!env.DB) throw new Error('D1 binding "DB" not found');
      return env.DB;
    },
    async get(req) {
      if (req.env?.DB) return { type: 'd1', db: this.d1(req) };
      return { type: 'mongo', db: await this.mongo() };
    }
  };

  function sanitize(data) {
    const out = {};
    Object.entries(data).forEach(([k, v]) => {
      if (!CONF.validFields.includes(k)) return;
      if (CONF.jsonFields.includes(k)) {
        // JSON object field (e.g. order) — keep objects as-is, never stringify.
        if (v !== undefined && v !== null && v !== '') out[k] = v;
      }
      else if (CONF.arrayFields.includes(k)) out[k] = Array.isArray(v) ? v.map(item => (item !== null && typeof item === 'object' ? item : String(item))) : [];
      else if (k === 'order') {
        if (v !== undefined && v !== null && v !== '') out[k] = String(v);
      } else out[k] = v;
    });
    // `mark` is JSON now — normalise scalar form values into { value, hide }.
    if (CONF.jsonFields.includes('mark') && 'mark' in out) out.mark = cleanMarkForStore(out.mark, null);
    if (!out.createdAt && CONF.validFields.includes('createdAt')) out.createdAt = getCurrentFormattedDate();
    if (!out.updatedAt && CONF.validFields.includes('updatedAt')) out.updatedAt = getCurrentFormattedDate();
    return out;
  }
  function mapId(doc) {
    if (!doc) return doc;
    const res = { ...doc };
    if (res._id) {
      res.id = res._id.toString();
      delete res._id;
    }
    return res;
  }

  /* ---------- Batch POST (create many) ---------- */
  async function POST(req) {
    try {
      const { type, db } = await store.get(req);
      const body = await req.json();
      let items = Array.isArray(body) ? body : body.data || body[CONF.collectionName.toLowerCase()];
      if (!Array.isArray(items)) return NextResponse.json({ error: 'Expected array' }, { status: 400 });
      if (CONF.beforeBatchCreate) items = await CONF.beforeBatchCreate(items);

      const errors = [];
      const inserts = [];

      for (const item of items) {
        const doc = sanitize(item);
        if (CONF.requiredFields.length) {
          const miss = CONF.requiredFields.filter(f => !doc[f]);
          if (miss.length) {
            errors.push({ item, error: 'Missing required fields', fields: miss });
            continue;
          }
        }
        if (CONF.customValidation) {
          const cv = await CONF.customValidation(doc, 'create');
          if (!cv.valid) {
            errors.push({ item, error: cv.error || 'Validation failed' });
            continue;
          }
        }
        // unique checks
        if (CONF.uniqueFields.length) {
          for (const f of CONF.uniqueFields) {
            if (doc[f] === undefined) continue;
            if (type === 'd1') {
              const { results } = await db.prepare(`SELECT 1 FROM ${CONF.collectionName} WHERE ${f}=? LIMIT 1`).bind(doc[f]).all();
              if (results.length) {
                errors.push({ item, error: `${f} already exists`, field: f });
                break;
              }
            } else {
              const col = db;
              const existing = await col.findOne({ [f]: doc[f] });
              if (existing) {
                errors.push({ item, error: `${f} already exists`, field: f });
                break;
              }
            }
          }
          if (errors.some(e => e.item === item)) continue;
        }
        const id = crypto.randomUUID();
        doc.id = id;
        inserts.push(doc);
      }

      if (type === 'd1') {
        const stmt = `INSERT INTO ${CONF.collectionName} (${Object.keys(inserts[0]).join(',')}) VALUES (${Object.keys(inserts[0]).map(() => '?').join(',')})`;
        await Promise.all(inserts.map(row => db.prepare(stmt).bind(...Object.values(row)).run()));
      } else {
        const col = db;
        await col.insertMany(inserts);
      }
      if (CONF.afterBatchCreate) await CONF.afterBatchCreate(inserts);
      invalidateListCache(CONF.collectionName);

      const resp = { message: 'Batch create completed', success: inserts.length, failed: errors.length };
      if (errors.length) resp.errors = errors;
      return NextResponse.json(resp, { status: 201 });
    } catch (e) {
      console.log('Batch create error:', e);
      return NextResponse.json({ error: 'Failed to perform batch create', details: e.message }, { status: 500 });
    }
  }

  /* ---------- Batch DELETE (delete many) ---------- */
  async function DELETE(req) {
    try {
      const { type, db } = await store.get(req);
      const body = await req.json();
      const ids = body.ids || body[`${CONF.collectionName.toLowerCase()}_ids`] || [];
      if (!Array.isArray(ids) || !ids.length) return NextResponse.json({ error: 'Expected non-empty array of IDs' }, { status: 400 });
      if (CONF.beforeBatchDelete) await CONF.beforeBatchDelete(ids);

      const okIds = ids.filter(id => ObjectId.isValid(id));
      if (!okIds.length) return NextResponse.json({ error: 'No valid IDs' }, { status: 400 });

      let result;
      if (type === 'd1') {
        const placeholders = okIds.map(() => '?').join(',');
        const { meta } = await db.prepare(`DELETE FROM ${CONF.collectionName} WHERE id IN (${placeholders})`).bind(...okIds).run();
        result = { deletedCount: meta.changes };
      } else {
        const col = db;
        result = CONF.enableSoftDelete
          ? await col.updateMany({ _id: { $in: okIds.map(id => new ObjectId(id)) } }, { $set: { deletedAt: getCurrentFormattedDate() } })
          : await col.deleteMany({ _id: { $in: okIds.map(id => new ObjectId(id)) } });
      }
      if (CONF.afterBatchDelete) await CONF.afterBatchDelete(result);
      invalidateListCache(CONF.collectionName);

      const resp = {
        message: CONF.enableSoftDelete ? 'Batch soft-delete completed' : 'Batch delete completed',
        success: CONF.enableSoftDelete ? result.modifiedCount : result.deletedCount,
        total: okIds.length
      };
      return NextResponse.json(resp);
    } catch (e) {
      console.log('Batch delete error:', e);
      return NextResponse.json({ error: 'Failed to perform batch delete', details: e.message }, { status: 500 });
    }
  }

  return { GET, PUT, POST, DELETE };
}