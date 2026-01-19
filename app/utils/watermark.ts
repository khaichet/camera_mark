import { WatermarkStyle } from "@/app/components/WatermarkTemplates";

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
  style?: WatermarkStyle;
}

const drawStyledText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string = "Arial",
  fontWeight: string = "normal",
  primaryColor: string = "#FFFFFF",
  shadowEnabled: boolean = true
) => {
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  
  if (shadowEnabled) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
    ctx.lineWidth = 3;
    ctx.strokeText(text, x, y);
  }
  
  ctx.fillStyle = primaryColor;
  ctx.fillText(text, x, y);
};

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

const drawStyledWrappedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  fontSize: number,
  fontFamily: string,
  primaryColor: string,
  shadowEnabled: boolean
): number => {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  ctx.font = `normal ${fontSize}px ${fontFamily}`;

  words.forEach((word) => {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && line.length > 0) {
      drawStyledText(ctx, line, x, currentY, fontSize, fontFamily, "normal", primaryColor, shadowEnabled);
      line = word + " ";
      currentY -= lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line.trim().length > 0) {
    drawStyledText(ctx, line, x, currentY, fontSize, fontFamily, "normal", primaryColor, shadowEnabled);
  }

  return currentY;
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

    const style = config.style;
    const now = new Date();
    const padding = canvas.width * 0.04;
    
    // Get style settings
    const primaryColor = style?.primaryColor || "#FFFFFF";
    const secondaryColor = style?.secondaryColor || "#F59E0B";
    const accentColor = style?.accentColor || "#F59E0B";
    const fontFamily = style?.fontFamily || "Arial";
    const shadowEnabled = style?.shadowEnabled ?? true;
    const layout = style?.layout || "bottom-left";
    
    // Font size multipliers based on style
    const fontSizeMultiplier = style?.fontSize === "small" ? 0.8 : style?.fontSize === "large" ? 1.3 : 1;
    
    // Calculate position based on layout
    let startX = padding;
    let startY = canvas.height - padding;
    let textAlign: CanvasTextAlign = "left";
    
    switch (layout) {
      case "bottom-right":
        startX = canvas.width - padding;
        textAlign = "right";
        break;
      case "bottom-center":
        startX = canvas.width / 2;
        textAlign = "center";
        break;
      case "top-left":
        startY = padding * 4;
        break;
      case "top-right":
        startX = canvas.width - padding;
        startY = padding * 4;
        textAlign = "right";
        break;
      case "center":
        startX = canvas.width / 2;
        startY = canvas.height / 2;
        textAlign = "center";
        break;
    }
    
    ctx.textAlign = textAlign;
    let currentX = startX;
    let currentY = startY;

    const addressParts: string[] = [];
    if (config.addressInfo && (style?.showAddress ?? true)) {
      if (config.addressInfo.houseNumber) addressParts.push(config.addressInfo.houseNumber);
      if (config.addressInfo.street) addressParts.push(config.addressInfo.street);
      if (config.addressInfo.ward) addressParts.push(config.addressInfo.ward);
      if (config.addressInfo.district) addressParts.push(config.addressInfo.district);
      if (config.addressInfo.province) addressParts.push(config.addressInfo.province);
    }

    const fullAddress = addressParts.join(", ");

    const baseFontSize = canvas.width * 0.035 * fontSizeMultiplier;
    const timeFontSize = baseFontSize * 2.5;
    const dateFontSize = baseFontSize * 0.9;
    const lineHeight = baseFontSize * 1.3;

    // Calculate total content height for proper positioning
    let contentHeight = 0;
    if (style?.showTime ?? true) contentHeight += timeFontSize;
    if (style?.showDate ?? true) contentHeight += lineHeight * 2;
    if (config.userName && (style?.showUsername ?? true)) contentHeight += lineHeight * 1.2;
    if (fullAddress && (style?.showAddress ?? true)) contentHeight += lineHeight * 2;
    if (style?.showCoordinates && config.currentLocation) contentHeight += lineHeight;

    // Draw background blur effect if enabled
    if (style?.backgroundBlur) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      const blurHeight = contentHeight + padding * 2;
      const blurY = layout.startsWith("top") ? 0 : canvas.height - blurHeight - padding;
      ctx.fillRect(0, blurY, canvas.width, blurHeight + padding);
    }

    // Draw border if enabled - will be drawn after calculating actual content bounds
    const borderPadding = padding * 0.5;
    let borderY = 0;
    let borderHeight = 0;
    let borderX = borderPadding;
    let borderWidth = canvas.width - borderPadding * 2;
    
    if (style?.borderEnabled) {
      borderHeight = contentHeight + padding;
      borderY = layout.startsWith("top") ? borderPadding : canvas.height - borderHeight - borderPadding - padding;
      
      // For center alignment, draw a centered box
      if (textAlign === "center") {
        borderWidth = canvas.width * 0.8;
        borderX = (canvas.width - borderWidth) / 2;
      }
    }

    ctx.textAlign = textAlign;
    ctx.font = `normal ${baseFontSize}px ${fontFamily}`;

    // Draw border first (behind content)
    if (style?.borderEnabled) {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(borderX, borderY, borderWidth, borderHeight);
    }

    // Calculate starting Y position based on content
    // For bottom layouts, we need to position content so it ends at the bottom
    let drawY = currentY;
    
    // For bottom layouts, calculate where time should start (topmost element)
    // and work downward from there
    if (layout.startsWith("bottom") || layout === "center") {
      // Calculate total height needed
      let totalHeight = 0;
      if (style?.showTime ?? true) totalHeight += timeFontSize;
      if (style?.showDate ?? true) totalHeight += lineHeight * 2.2;
      if (config.userName && (style?.showUsername ?? true)) totalHeight += lineHeight * 1.2;
      if (fullAddress && (style?.showAddress ?? true)) totalHeight += lineHeight * 1.5;
      if (style?.showCoordinates && config.currentLocation) totalHeight += lineHeight;
      
      // Start drawing from top of content area
      drawY = currentY - totalHeight;
    }

    // Draw time first (at top)
    if (style?.showTime ?? true) {
      const timeString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
      
      ctx.textAlign = textAlign;
      
      // For neon theme, add glow effect
      if (style?.theme === "neon") {
        ctx.shadowColor = secondaryColor;
        ctx.shadowBlur = 20;
      }
      
      drawStyledText(ctx, timeString, currentX, drawY, timeFontSize, fontFamily, "bold", primaryColor, shadowEnabled);
      ctx.shadowBlur = 0;
      drawY += timeFontSize * 0.3;
      
      // Draw date below time
      if (style?.showDate ?? true) {
        const dateString = now.toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const weekdayString = now.toLocaleDateString("vi-VN", {
          weekday: "long",
        });
        
        drawY += lineHeight;
        drawStyledText(ctx, dateString, currentX, drawY, dateFontSize, fontFamily, "normal", primaryColor, shadowEnabled);
        drawY += lineHeight;
        drawStyledText(ctx, weekdayString, currentX, drawY, dateFontSize, fontFamily, "normal", secondaryColor, shadowEnabled);
      }
    }

    // Draw username
    if (config.userName && (style?.showUsername ?? true)) {
      drawY += lineHeight * 1.2;
      drawStyledText(ctx, config.userName, currentX, drawY, baseFontSize, fontFamily, "normal", primaryColor, shadowEnabled);
    }

    // Draw address
    if (fullAddress && (style?.showAddress ?? true)) {
      drawY += lineHeight * 1.2;
      drawStyledText(ctx, fullAddress, currentX, drawY, baseFontSize, fontFamily, "normal", primaryColor, shadowEnabled);
    }

    // Draw coordinates if enabled
    if (style?.showCoordinates && config.currentLocation) {
      drawY += lineHeight;
      const coordString = `📍 ${config.currentLocation.latitude.toFixed(6)}, ${config.currentLocation.longitude.toFixed(6)}`;
      drawStyledText(ctx, coordString, currentX, drawY, baseFontSize * 0.8, fontFamily, "normal", secondaryColor, shadowEnabled);
    }

    // Draw logo
    if (config.companyLogo && (style?.showLogo ?? true)) {
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
