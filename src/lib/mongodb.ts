import { MongoClient, MongoClientOptions } from 'mongodb';

// ─── 环境变量校验 ────────────────────────────────────────────────
const uri = process.env.MONGODB_URL;
if (!uri) throw new Error('请在环境变量中设置 MONGODB_URL');

// ─── 连接配置 ────────────────────────────────────────────────────
const options: MongoClientOptions = {
  // Serverless 核心：限制连接池，防止耗尽 Atlas M0 的 500 上限
  maxPoolSize: 10,
  minPoolSize: 0,          // Serverless 不保持最小连接

  // 超时设置（毫秒）
  serverSelectionTimeoutMS: 10_000,   // 找不到服务器时的超时
  socketTimeoutMS: 45_000,            // 单次操作超时
  connectTimeoutMS: 10_000,           // 建立连接超时

  // 自动重连（驱动默认开启，显式声明更清晰）
  retryWrites: true,
  retryReads: true,
};

// ─── 全局单例类型声明 ────────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// ─── 单例逻辑（dev 和 prod 统一走 global，解决你原来 prod 每次新建的问题）──
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  const client = new MongoClient(uri, options);

  global._mongoClientPromise = client.connect().catch((err) => {
    // 连接失败时清除缓存，下次请求可以重试
    global._mongoClientPromise = undefined;
    throw err;
  });
}

clientPromise = global._mongoClientPromise;

export default clientPromise;

// ─── 工具函数：获取指定数据库 ────────────────────────────────────
export async function getDb(dbName?: string) {
  const client = await clientPromise;
  return client.db(dbName ?? process.env.MONGODB_DB_NAME);
}

// ─── 工具函数：健康检查（用于 /api/health 路由）──────────────────
export async function pingDb(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const client = await clientPromise;
    await client.db('admin').command({ ping: 1 });
    return { ok: true, latencyMs: Date.now() - start };
  } catch {
    return { ok: false, latencyMs: Date.now() - start };
  }
}