/**
 * /api/meta
 *
 * Singleton document in the `Meta` collection — everything the manager can
 * edit about the site itself (title, footer, website URL, menus, SEO tags,
 * gallery entity mapping and form type options).
 *
 *   GET  → { data: <meta doc> }   (creates it from the JSON defaults on first
 *                                  read, so the doc always exists)
 *   PUT  → { data: <meta doc> }   body: partial meta; merged into the doc.
 *   POST → same as PUT (compat with the generic api shell)
 */

import { NextResponse } from "next/server";
import { getDefaultSiteMeta } from "@/utils/siteMetaDefaults";
import { readMetaDoc, updateMetaDoc } from "@/lib/siteMetaServer";

const noCache = (data, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

/** Editable top-level string fields. */
const STRING_FIELDS = [
  "app_footer_en",
  "app_footer_cn",
  "app_footer_rights_en",
  "app_footer_rights_cn",
];
/** Editable structured fields (stored as-is). */
const JSON_FIELDS = ["menu", "seo", "formTypes"];

/** Shape the incoming body into something safe to $set. */
function sanitize(input = {}) {
  const out = {};

  STRING_FIELDS.forEach((key) => {
    if (input[key] === undefined) return;
    out[key] = input[key] === null ? null : String(input[key]);
  });

  if (input.app_footer_start_year !== undefined) {
    const n = Number(input.app_footer_start_year);
    out.app_footer_start_year = Number.isFinite(n) ? n : null;
  }

  JSON_FIELDS.forEach((key) => {
    if (input[key] === undefined) return;
    out[key] = input[key];
  });

  // No `footer` JSON block anymore — the flat `app_footer_*` fields are the
  // single source of truth.
  return out;
}

export async function GET() {
  try {
    const { doc } = await readMetaDoc();
    return noCache({ data: { ...doc, id: String(doc._id) } });
  } catch (error) {
    console.log("[/api/meta] GET failed:", error);
    // Never let a DB hiccup break the shell — hand back the JSON defaults.
    return noCache({ data: { ...getDefaultSiteMeta(), id: null }, fallback: true });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const patch = sanitize(body);
    if (!Object.keys(patch).length) return noCache({ error: "Nothing to update" }, 400);

    const doc = await updateMetaDoc(patch);
    return noCache({ data: { ...doc, id: String(doc._id) } });
  } catch (error) {
    console.log("[/api/meta] PUT failed:", error);
    return noCache({ error: "Failed to update meta" }, 500);
  }
}

export const POST = PUT;
