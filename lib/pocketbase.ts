import PocketBase from 'pocketbase';

const pbUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://files.hupuna.vn/';


export function createPocketBaseInstance() {
  return new PocketBase(pbUrl);
}


export async function getAuthenticatedPocketBase() {
  const pb = createPocketBaseInstance();
  const identity = process.env.NEXT_PUBLIC_POCKETBASE_USER_ID;
  const password = process.env.NEXT_PUBLIC_POCKETBASE_PASSWORD;

  if (!identity || !password) {
    throw new Error('Missing PocketBase credentials in environment variables');
  }

  pb.autoCancellation(false); 

  try {
    try {
      await pb.admins.authWithPassword(identity, password);
    } catch {
      await pb.collection('users').authWithPassword(identity, password);
    }

    return pb;
  } catch (error) {
    console.error('Failed to authenticate with PocketBase:', error);
    throw new Error('PocketBase authentication failed');
  }
}

/**
 * Lấy thông tin người dùng hiện tại từ PocketBase
 * @param pb - PocketBase instance đã được authenticate
 * @returns User ID của người dùng đang login hoặc undefined
 */
export function getUserIdFromPocketBase(pb: PocketBase): string | undefined {
  return pb.authStore.model?.id;
}

/**
 * Lấy URL đầy đủ của một file trên PocketBase
 * @param collectionId - ID của collection
 * @param recordId - ID của record
 * @param filename - Tên file
 * @returns URL đầy đủ
 */
export function getPocketBaseFileUrl(
  collectionId: string,
  recordId: string,
  filename: string
): string {
  const baseUrl = pbUrl.endsWith('/') ? pbUrl.slice(0, -1) : pbUrl;
  return `${baseUrl}/api/files/${collectionId}/${recordId}/${filename}`;
}

export default createPocketBaseInstance;
