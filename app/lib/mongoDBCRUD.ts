import { connectToDatabase } from "./mongodb";

// ========== CREATE ==========
export const addRow = async <T extends Record<string, unknown>>(
  collectionName: string,
  newData: T,
): Promise<string> => {
  const { db } = await connectToDatabase();
  const result = await db.collection(collectionName).insertOne(newData);
  return result.insertedId.toString();
};
