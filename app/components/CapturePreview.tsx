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

  useEffect(() => {
    // Vẽ watermark lên canvas để preview
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx && watermarkConfig) {
        ctx.drawImage(img, 0, 0);
        await drawWatermark(canvas, {
          addressInfo: watermarkConfig.addressInfo,
          currentLocation: null,
          currentTime: watermarkConfig.currentTime,
          userName: watermarkConfig.userName,
          companyLogo: watermarkConfig.companyLogo,
          timeFormat: watermarkConfig.timeFormat,
        });
        setPreviewWithWatermark(canvas.toDataURL("image/png"));
      }
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
    <div className="fixed inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full h-full max-w-full max-h-full flex items-center justify-center">
        <img
          src={previewWithWatermark}
          alt="Captured"
          className="max-w-full max-h-[80vh] md:max-h-[70vh] object-contain rounded"
        />
        <img
          src="/asset/logo.png"
          alt="Logo"
          className="absolute top-4 right-4 h-6 md:h-8 w-auto"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 pb-8 px-4 flex gap-2 md:gap-4 flex-wrap justify-center">
        <button
          onClick={onRetake}
          disabled={isSaving}
          className="px-4 md:px-6 py-2 text-sm md:text-base bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 rounded text-white disabled:cursor-not-allowed"
        >
          Chụp lại
        </button>
        <button
          onClick={() => setShowEditor(true)}
          disabled={isSaving}
          className="px-4 md:px-6 py-2 text-sm md:text-base bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400 rounded text-white disabled:cursor-not-allowed"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={() => {
            setIsSaving(true);
            onSave(previewWithWatermark).finally(() => setIsSaving(false));
          }}
          disabled={isSaving}
          className="px-4 md:px-6 py-2 text-sm md:text-base bg-green-500 hover:bg-green-600 disabled:bg-green-400 rounded text-white disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? <>Đang lưu...</> : "Lưu"}
        </button>
      </div>
    </div>
  );
};
