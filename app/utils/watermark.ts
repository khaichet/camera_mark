interface WatermarkConfig {
  addressInfo: {
    houseNumber?: string;
    street?: string;
    ward?: string;
    district?: string;
    province?: string;
    country?: string;
  } | null;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  currentTime: string;
  userName?: string;
  companyLogo?: string | null;
  timeFormat: string;
}

// Helper: Vẽ chữ trắng với viền đen
const drawWhiteText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string = "Arial",
  fontWeight: string = "normal"
) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  
  // Vẽ viền đen (stroke)
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeText(text, x, y);
  
  // Vẽ chữ trắng (fill)
  ctx.fillStyle = "white";
  ctx.fillText(text, x, y);
};

// Helper: Vẽ text với tự động xuống dòng
const drawWrappedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number => {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  words.forEach((word) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line.length > 0) {
      // Vẽ dòng hiện tại
      drawWhiteText(ctx, line, x, currentY, ctx.font.split("px")[0] as any);
      line = word + " ";
      currentY -= lineHeight; // Lùi lên để vẽ dòng mới
    } else {
      line = testLine;
    }
  });

  // Vẽ dòng cuối cùng
  if (line.trim().length > 0) {
    drawWhiteText(ctx, line, x, currentY, ctx.font.split("px")[0] as any);
  }

  return currentY;
};

export const drawWatermark = (
  canvas: HTMLCanvasElement,
  config: WatermarkConfig
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const now = new Date();
  const padding = canvas.width * 0.04; // Padding 4%
  let currentX = padding;
  let currentY = canvas.height - padding; // Vẽ từ dưới lên

  // A. Chuẩn bị nội dung Địa chỉ
  const addressParts: string[] = [];
  if (config.addressInfo) {
    if (config.addressInfo.houseNumber) addressParts.push(config.addressInfo.houseNumber);
    if (config.addressInfo.street) addressParts.push(config.addressInfo.street);
    if (config.addressInfo.ward) addressParts.push(config.addressInfo.ward);
    if (config.addressInfo.district) addressParts.push(config.addressInfo.district);
    if (config.addressInfo.province) addressParts.push(config.addressInfo.province);
  }

  // Nếu không có địa chỉ chi tiết thì dùng tọa độ làm backup
  if (addressParts.length === 0 && config.currentLocation) {
    addressParts.push(
      `${config.currentLocation.latitude.toFixed(6)}, ${config.currentLocation.longitude.toFixed(6)}`
    );
  }

  // Thêm username nếu có
  if (config.userName) {
    addressParts.push(`Người chụp: ${config.userName}`);
  }

  const fullAddress = addressParts.join(", ");

  // B. Cấu hình Font Size
  const baseFontSize = canvas.width * 0.035; // Cỡ chữ cơ bản cho địa chỉ
  const timeFontSize = baseFontSize * 2.5; // Cỡ chữ giờ (to gấp 2.5 lần)
  const dateFontSize = baseFontSize * 0.9; // Cỡ chữ ngày tháng (nhỏ hơn xíu)
  const lineHeight = baseFontSize * 1.3;

  // C. Vẽ Địa chỉ (Vẽ trước để tính vị trí các phần trên)
  ctx.font = `normal ${baseFontSize}px Arial`;
  const addressStartY = currentY - lineHeight; // Lùi lên 1 dòng
  
  // Vẽ địa chỉ, tự động xuống dòng nếu quá 70% chiều rộng ảnh
  drawWrappedText(ctx, fullAddress, currentX, addressStartY, canvas.width * 0.7, lineHeight);

  // D. Tính vị trí cho cụm Ngày/Giờ (Nằm trên khối địa chỉ)
  currentY = addressStartY - timeFontSize + baseFontSize / 2;
  currentX = padding;

  // E. Vẽ Giờ (Ví dụ: 10:23)
  const timeString = now.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  drawWhiteText(ctx, timeString, currentX, currentY, timeFontSize, "Arial", "bold");
  const timeWidth = ctx.measureText(timeString).width;
  currentX += timeWidth + padding / 2;

  // F. Vẽ Thanh gạch đứng màu vàng cam (|)
  ctx.fillStyle = "#F59E0B"; // Màu vàng cam (amber-500)
  ctx.fillRect(
    currentX,
    currentY - timeFontSize + padding / 4,
    padding / 8,
    timeFontSize
  );
  currentX += padding / 2 + padding / 8;

  // G. Vẽ Ngày tháng & Thứ
  const dateString = now.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const weekdayString = now.toLocaleDateString("vi-VN", {
    weekday: "long",
  });

  const dateX = currentX;
  const dateY = currentY - timeFontSize / 2 + dateFontSize / 2;

  // Dòng Ngày tháng
  drawWhiteText(ctx, dateString, dateX, dateY - lineHeight / 2, dateFontSize);
  // Dòng Thứ
  drawWhiteText(ctx, weekdayString, dateX, dateY + lineHeight / 2, dateFontSize);

  // H. Vẽ company logo nếu có (góc trên phải)
  if (config.companyLogo) {
    const logoImg = new Image();
    logoImg.onload = () => {
      const maxLogoWidth = canvas.width * 0.15;
      const maxLogoHeight = canvas.height * 0.15;
      let logoWidth = logoImg.width;
      let logoHeight = logoImg.height;

      // Scale logo để fit vào kích thước tối đa
      const scale = Math.min(
        maxLogoWidth / logoWidth,
        maxLogoHeight / logoHeight,
        1
      );
      logoWidth *= scale;
      logoHeight *= scale;

      // Vẽ logo ở góc trên phải
      const logoX = canvas.width - logoWidth - 20;
      const logoY = 20;

      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
    };
    logoImg.src = config.companyLogo;
  }
};
