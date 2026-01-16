/**
 * Nén ảnh để giảm kích thước file
 * @param imageData - Data URL của ảnh
 * @param quality - Chất lượng nén (0-1), default: 0.7
 * @returns Data URL của ảnh đã nén
 */
export function compressImage(
  imageData: string,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Cannot load image"));
    img.src = imageData;
  });
}

/**
 * Tải logo với cache
 */
async function getCachedLogo(logoUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.onload = () => resolve(logoImg);
    logoImg.onerror = () => reject(new Error("Cannot load logo"));
    logoImg.src = logoUrl;
  });
}

/**
 * Vẽ logo Hupuna vào ảnh
 * @param imageData - Data URL của ảnh
 * @param logoUrl - URL của logo (default: /asset/logo.png)
 * @returns Data URL của ảnh có logo
 */
export async function addLogoToImage(
  imageData: string,
  logoUrl: string = "/asset/logo.png"
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { alpha: false });

        if (!ctx) {
          reject(new Error("Cannot get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        try {
          const logoImg = await getCachedLogo(logoUrl);
          const maxLogoWidth = canvas.width * 0.2;
          const maxLogoHeight = canvas.height * 0.2;
          let logoWidth = logoImg.width;
          let logoHeight = logoImg.height;

          const scale = Math.min(
            maxLogoWidth / logoWidth,
            maxLogoHeight / logoHeight,
            1
          );
          logoWidth *= scale;
          logoHeight *= scale;

          const logoX = canvas.width - logoWidth - 20;
          const logoY = 20;

          ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        } catch (error) {
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        }
      };
      img.onerror = () => reject(new Error("Cannot load image"));
      img.src = imageData;
    } catch (error) {
      reject(error);
    }
  });
}
