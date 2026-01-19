"use client";

import { useState, useEffect, useRef } from "react";
import { ImageEditor } from "./ImageEditor";
import { drawWatermark } from "@/app/utils/watermark";

interface WatermarkConfig {
  addressInfo: any;
  currentTime: string;
  userName?: string;
  companyLogo?: string | null;
  timeFormat: string;
}

interface CapturePreviewProps {
  image: string;
  onRetake: () => void;
  onSave: (editedImage: string) => Promise<void>;
  watermarkConfig?: WatermarkConfig;
}

export const CapturePreview: React.FC<CapturePreviewProps> = ({
  image,
  onRetake,
  onSave,
  watermarkConfig,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editedImage, setEditedImage] = useState(image);
  const [previewWithWatermark, setPreviewWithWatermark] = useState(image);
  const [isProcessing, setIsProcessing] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setEditedImage(image);
    setPreviewWithWatermark(image);
    setIsProcessing(true);
  }, [image]);

  useEffect(() => {
    setIsProcessing(true);
    const img = new Image();
    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          // Use default config if watermarkConfig is not provided
          const config = watermarkConfig || {
            addressInfo: null,
            currentTime: new Date().toLocaleString("vi-VN"),
            userName: "",
            companyLogo: null,
            timeFormat: "DD/MM/YYYY HH:mm",
          };
          await drawWatermark(canvas, {
            addressInfo: config.addressInfo,
            currentLocation: null,
            currentTime: config.currentTime,
            userName: config.userName,
            timeFormat: config.timeFormat,
          });
          setPreviewWithWatermark(canvas.toDataURL("image/png"));
        }
      } catch (error) {
        console.error("Error processing watermark:", error);
        setPreviewWithWatermark(editedImage);
      } finally {
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      console.error("Error loading image");
      setIsProcessing(false);
      setPreviewWithWatermark(editedImage);
    };
    img.src = editedImage;
  }, [editedImage, watermarkConfig]);

  const handleEditorComplete = (finalImage: string) => {
    setEditedImage(finalImage);
    setShowEditor(false);
  };

  if (showEditor) {
    return (
      <ImageEditor
        image={editedImage}
        onComplete={handleEditorComplete}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center">
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Đang xử lý ảnh...</p>
          </div>
        </div>
      )}
      <div className="relative">
        <img
          src={previewWithWatermark}
          alt="Captured"
          className="max-h-[70vh] max-w-full rounded"
        />
        <img
          src="/asset/logo.png"
          alt="Logo"
          className="absolute top-2 right-2 h-8 w-auto"
        />
      </div>
      <div className="flex gap-4 mt-6 flex-wrap justify-center">
        <button
          onClick={onRetake}
          disabled={isSaving || isProcessing}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 rounded text-white disabled:cursor-not-allowed"
        >
          Chụp lại
        </button>
        <button
          onClick={() => setShowEditor(true)}
          disabled={isSaving || isProcessing}
          className="px-6 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 rounded text-white disabled:cursor-not-allowed"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={() => {
            setIsSaving(true);
            onSave(previewWithWatermark).finally(() => setIsSaving(false));
          }}
          disabled={isSaving || isProcessing}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 rounded text-white disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? <>Đang lưu...</> : "Lưu"}
        </button>
      </div>
    </div>
  );
};
