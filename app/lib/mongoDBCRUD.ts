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

// ========== READ ==========
export const getAllRows = async <T extends Record<string, unknown>>(
  collectionName: string,
  {
    field,
    value,
    sort,
    limit,
    skip = 0,
  }: {
    field?: keyof T;
    value?: unknown;
    sort?: { field: keyof T; order?: 'asc' | 'desc' };
    limit?: number;
    skip?: number;
  } = {},
): Promise<{ total: number; data: T[] }> => {
  const { db } = await connectToDatabase();
  const collection = db.collection(collectionName);

  const query: Record<string, unknown> = {};
  if (field && value !== undefined) {
    query[field as string] = value;
  }

  const sortOption: Record<string, 1 | -1> = {};
  if (sort) {
    sortOption[sort.field as string] = sort.order === 'desc' ? -1 : 1;
  }

  const total = await collection.countDocuments(query);
  const data = await collection
    .find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit ?? 0)
    .toArray();

  return { total, data: data as unknown as T[] };
};
