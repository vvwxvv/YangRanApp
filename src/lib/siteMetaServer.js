/**
 * siteMetaServer.js — server-side helpers for the singleton `Meta` document.
 *
 * Used by `/api/meta` (GET/PUT) and by anything server-side that needs the
 * site meta before render. Falls back to the JSON defaults when the DB is
 * unavailable, so the app never hard-fails on a Meta problem.
 */

import { MongoClient } from "mongodb";
import { getDefaultSiteMeta, mergeSiteMeta } from "@/utils/siteMetaDefaults";

const uri = process.env.MONGODB_URL || "";
const dbName = process.env.MONGODB_DB || "";
export const META_COLLECTION = "Meta";

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  cachedDb = cachedClient.db(dbName);
  return cachedDb;
}

/** Read the doc, creating it from the defaults when it does not exist yet. */
export async function readMetaDoc() {
  const db = await connectDB();
  const collection = db.collection(META_COLLECTION);
  let doc = await collection.findOne({});
  if (!doc) {
    const defaults = getDefaultSiteMeta();
    const res = await collection.insertOne({ ...defaults, updatedAt: new Date() });
    doc = { ...defaults, _id: res.insertedId, updatedAt: new Date() };
  }
  return { collection, doc };
}

/** Doc merged over the defaults (complete, safe shape). */
export async function getMetaMerged() {
  try {
    const { doc } = await readMetaDoc();
    const plain = { ...doc };
    delete plain._id;
    return mergeSiteMeta(getDefaultSiteMeta(), plain);
  } catch (error) {
    console.log("[siteMetaServer] getMetaMerged failed:", error);
    return getDefaultSiteMeta();
  }
}

/** $set a sanitized patch and return the stored doc. */
export async function updateMetaDoc(patch) {
  const { collection } = await readMetaDoc();
  await collection.updateOne({}, { $set: { ...patch, updatedAt: new Date() } }, { upsert: true });
  return collection.findOne({});
}
