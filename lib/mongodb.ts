import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

// 1. Cấu hình cứng tên DB để tránh sai sót
const DB_NAME = process.env.MONGODB_DB || 'hupuna-demozalo';

// 2. Xử lý URI: Nếu URI chưa có tên DB thì nối vào luôn.
// Việc này an toàn hơn là dùng option { dbName }
let uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
if (!uri.includes(DB_NAME)) {
  // Xóa dấu / ở cuối nếu có, rồi nối tên DB vào
  uri = uri.replace(/\/$/, '') + '/' + DB_NAME;
}

const MONGODB_URI = uri;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Nếu đã cache Native Client thì trả về luôn
  if (cachedClient && cachedDb) {
    // Kể cả khi có cache native, vẫn cần đảm bảo Mongoose đã kết nối
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    return { client: cachedClient, db: cachedDb };
  }

  // Check log ở server console để biết chính xác nó đang kết nối đi đâu
  console.log('🔌 Connecting to MongoDB with URI:', MONGODB_URI); 

  // --- PHẦN 1: Native Driver (Dùng cho cachedClient) ---
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  // --- PHẦN 2: Mongoose (Quan trọng cho API của bạn) ---
  // Ở đây mình bỏ { dbName } vì đã gộp thẳng vào URI ở trên rồi.
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Mongoose connected to:', mongoose.connection.name);
  }

  return { client, db };
}