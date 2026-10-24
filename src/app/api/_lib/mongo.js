// src/app/api/_lib/mongo.js
/**
 * ONE shared MongoClient for every route handler.
 *
 * Why: this cluster is latency bound (a 500-row find measures 1–8 s; the TLS
 * handshake alone is ~1.4 s), and the API used to build its own client per
 * module — and, in the batch shell, a new client PER REQUEST, which was never
 * reused. Every extra connection therefore paid the handshake again, and the
 * manager's parallel requests were competing for fresh sockets.
 *
 * The connection is created once and awaited through a shared promise, so N
 * concurrent requests wait for ONE connect instead of starting N of them.
 */

import { MongoClient } from "mongodb";

let client = null;
let connectPromise = null;

/** Shared client (created + connected once per server process). */
export async function getMongoClient() {
  const uri = process.env.MONGODB_URL || "";
  const dbName = process.env.MONGODB_DB || "";

  if (!uri || !dbName) {
    throw new Error("Please define MONGODB_URL and MONGODB_DB environment variables");
  }

  if (!client) {
    client = new MongoClient(uri, {
      // The driver's defaults are fine; these just keep a warm pool without
      // holding many sockets open to a slow cluster.
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 60000,
      retryWrites: true,
      retryReads: true,
    });
    connectPromise = client.connect().catch((error) => {
      // Never cache a failed connect — the next request should try again.
      client = null;
      connectPromise = null;
      throw error;
    });
  }

  await connectPromise;
  return client;
}

/** Shared Db handle. */
export async function getDb() {
  const dbName = process.env.MONGODB_DB || "";
  const c = await getMongoClient();
  return c.db(dbName);
}

/** Shared collection handle. */
export async function getCollection(name) {
  const db = await getDb();
  return db.collection(name);
}

export default getDb;
