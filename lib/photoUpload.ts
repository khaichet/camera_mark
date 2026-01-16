/**
 * Convert base64/data URL thành File object
 * @param dataUrl - Data URL (ví dụ: data:image/png;base64,...)
 * @param fileName - Tên file
 * @returns File object
 */
export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}

/**
 * Import hàm vẽ logo
 */
import { addLogoToImage } from './addLogoToImage';

/**
 * Upload ảnh lên server (PocketBase)
 * @param file - File object
 * @param folder - Folder trên PocketBase (default: "camera")
 * @param userId - ID của người chụp ảnh
 * @returns Response từ API
 */
export async function uploadPhotoToServer(
  file: File,
  folder: string = 'camera',
  userId?: string
) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('folder', folder);
    
    if (userId) {
      formData.append('userId', userId);
    }

    const response = await fetch('/api/photos/save', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload photo');
    }

    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

/**
 * Lưu ảnh đã chụp lên PocketBase với logo Hupuna
 * @param capturedImage - Base64 string hoặc data URL từ canvas
 * @param fileName - Tên file (default: "photo.png")
 * @param folder - Folder trên PocketBase
 * @param userId - ID của người chụp ảnh
 * @returns Upload response
 */
export async function savePhotoCaptured(
  capturedImage: string,
  fileName: string = `photo_${Date.now()}.png`,
  folder: string = 'camera',
  userId?: string
) {
  try {
    // Thêm logo Hupuna vào ảnh
    const imageWithLogo = await addLogoToImage(capturedImage);
    
    const file = await dataUrlToFile(imageWithLogo, fileName);

    const result = await uploadPhotoToServer(file, folder, userId);

    return result;
  } catch (error) {
    console.error('Save photo error:', error);
    throw error;
  }
}
