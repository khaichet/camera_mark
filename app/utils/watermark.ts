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
  
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeText(text, x, y);
  
  ctx.fillStyle = "white";
  ctx.fillText(text, x, y);
};

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
      drawWhiteText(ctx, line, x, currentY, ctx.font.split("px")[0] as any);
      line = word + " ";
      currentY -= lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line.trim().length > 0) {
    drawWhiteText(ctx, line, x, currentY, ctx.font.split("px")[0] as any);
  }

  return currentY;
};

export const drawWatermark = (
  canvas: HTMLCanvasElement,
  config: WatermarkConfig
): Promise<void> => {
  return new Promise((resolve) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve();
      return;
    }

    const now = new Date();
    const padding = canvas.width * 0.04;
    let currentX = padding;
    let currentY = canvas.height - padding;

    const addressParts: string[] = [];
    if (config.addressInfo) {
      if (config.addressInfo.houseNumber) addressParts.push(config.addressInfo.houseNumber);
      if (config.addressInfo.street) addressParts.push(config.addressInfo.street);
      if (config.addressInfo.ward) addressParts.push(config.addressInfo.ward);
      if (config.addressInfo.district) addressParts.push(config.addressInfo.district);
      if (config.addressInfo.province) addressParts.push(config.addressInfo.province);
    }

    const fullAddress = addressParts.join(", ");

    const baseFontSize = canvas.width * 0.035;
    const timeFontSize = baseFontSize * 2.5;
    const dateFontSize = baseFontSize * 0.9;
    const lineHeight = baseFontSize * 1.3;

    ctx.font = `normal ${baseFontSize}px Arial`;
    const addressStartY = currentY - lineHeight;
    
    drawWrappedText(ctx, fullAddress, currentX, addressStartY, canvas.width * 0.7, lineHeight);

    let userNameY = addressStartY - lineHeight * 0.9;
    if (config.userName) {
      drawWhiteText(ctx, config.userName, currentX, userNameY, baseFontSize);
      userNameY -= lineHeight * 0.3;
    }

    currentY = userNameY - timeFontSize * 0.6;
    currentX = padding;
    const timeString = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    drawWhiteText(ctx, timeString, currentX, currentY, timeFontSize, "Arial", "bold");
    const timeWidth = ctx.measureText(timeString).width;
    currentX += timeWidth + padding / 2;

    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(
      currentX,
      currentY - timeFontSize + padding / 4,
      padding / 8,
      timeFontSize
    );
    currentX += padding / 2 + padding / 8;

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

    drawWhiteText(ctx, dateString, dateX, dateY - lineHeight / 2, dateFontSize);
    drawWhiteText(ctx, weekdayString, dateX, dateY + lineHeight / 2, dateFontSize);

    if (config.companyLogo) {
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";
      
      const handleLogoLoad = () => {
        try {
          const maxLogoWidth = canvas.width * 0.15;
          const maxLogoHeight = canvas.height * 0.15;
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
        } catch (e) {
          console.warn("Failed to draw logo:", e);
        }
        resolve();
      };

      const handleLogoError = () => {
        console.warn("Failed to load logo");
        resolve();
      };

      // Set timeout to prevent hanging if logo takes too long
      const timeout = setTimeout(() => {
        logoImg.onload = null;
        logoImg.onerror = null;
        console.warn("Logo loading timeout");
        resolve();
      }, 3000);

      logoImg.onload = () => {
        clearTimeout(timeout);
        handleLogoLoad();
      };
      logoImg.onerror = () => {
        clearTimeout(timeout);
        handleLogoError();
      };
      logoImg.src = config.companyLogo;
    } else {
      resolve();
    }
  });
};
