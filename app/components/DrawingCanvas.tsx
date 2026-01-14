"use client";

import { useState, useRef, useEffect } from "react";
import { RotateCcw, X, Trash2, Check } from "lucide-react";

interface DrawingCanvasProps {
  image: string;
  onDrawComplete: (drawnImage: string) => void;
  onCancel: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  image,
  onDrawComplete,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historyRef = useRef<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#FF0000");
  const [brushSize, setBrushSize] = useState(3);
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        // Lưu trữ trạng thái ban đầu
        historyRef.current = [canvas.toDataURL("image/png")];
        setCanUndo(false);
      }
    };
    img.src = image;
  }, [image]);

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleDrawStart = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    // Prevent default touch behavior (scrolling, zooming)
    if ("touches" in e) {
      e.preventDefault();
    }

    const pos = getCanvasCoordinates(e);
    setIsDrawing(true);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "source-over";
  };

  const handleDrawMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !canvasRef.current) return;

    // Prevent default touch behavior
    if ("touches" in e) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getCanvasCoordinates(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleDrawEnd = (
    e?:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    // Prevent default touch behavior
    if (e && "touches" in e) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.closePath();
      // Lưu trạng thái sau khi vẽ
      const currentState = canvas!.toDataURL("image/png");
      if (historyRef.current[historyRef.current.length - 1] !== currentState) {
        historyRef.current.push(currentState);
        setCanUndo(true);
      }
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        historyRef.current = [canvas!.toDataURL("image/png")];
        setCanUndo(false);
      };
      img.src = image;
    }
  };

  const handleUndo = () => {
    if (historyRef.current.length <= 1) return;

    historyRef.current.pop();
    const previousState = historyRef.current[historyRef.current.length - 1];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setCanUndo(historyRef.current.length > 1);
      };
      img.src = previousState;
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const drawnImage = canvas.toDataURL("image/png");
      onDrawComplete(drawnImage);
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h2 className="text-white text-xl mb-4">Vẽ trên ảnh</h2>

        {/* Canvas */}
        <div className="bg-black rounded overflow-hidden mb-4 flex justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={handleDrawStart}
            onMouseMove={handleDrawMove}
            onMouseUp={handleDrawEnd}
            onMouseLeave={handleDrawEnd}
            onTouchStart={handleDrawStart}
            onTouchMove={handleDrawMove}
            onTouchEnd={handleDrawEnd}
            style={
              {
                maxWidth: "100%",
                maxHeight: "500px",
                cursor: "crosshair",
                touchAction: "none",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
              } as React.CSSProperties
            }
          />
        </div>

        <div className="bg-gray-800 p-4 rounded mb-4 flex gap-3">
          <div className="flex items-center gap-3">
            <label className="text-white text-sm">Màu sắc:</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-10 w-20 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-white text-sm">
              Kích thước: {brushSize}px
            </label>
            <input
              type="range"
              min="1"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white flex items-center gap-2"
          >
            <X size={18} />
          </button>
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed rounded text-white flex items-center gap-2"
            title="Hoàn tác"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white flex items-center gap-2"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-white flex items-center gap-2"
          >
            <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
