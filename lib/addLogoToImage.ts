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

      // Vẽ logo
      const logoImg = new Image();
      logoImg.onload = () => {
        // Kích thước logo: 20% chiều rộng canvas
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

        // Vị trí: góc trên bên phải, cách mép 20px
        const logoX = canvas.width - logoWidth - 20;
        const logoY = 20;

        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
        resolve(canvas.toDataURL("image/png"));
      };

      logoImg.onerror = () => {
        // Nếu logo không tải được, vẫn trả về ảnh (không có logo)
        resolve(canvas.toDataURL("image/png"));
      };

      // Logo có thể là data URL hoặc URL thường
      logoImg.crossOrigin = "anonymous";
      logoImg.src = logoUrl;
    };

    img.onerror = () => {
      reject(new Error("Cannot load image"));
    };

    img.src = imageData;
  });
}
