"use client";

import { useState } from "react";

interface CapturePreviewProps {
  image: string;
  onRetake: () => void;
  onSave: () => Promise<void>;
}

export const CapturePreview: React.FC<CapturePreviewProps> = ({
  image,
  onRetake,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  return (
    <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center">
      <div className="relative">
        <img
          src={image}
          alt="Captured"
          className="max-h-[70vh] max-w-full rounded"
        />
        <img
          src="/asset/logo.png"
          alt="Logo"
          className="absolute top-2 right-2 h-8 w-auto"
        />
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onRetake}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 rounded text-white disabled:cursor-not-allowed"
        >
          Chụp lại
        </button>
        <button
          onClick={() => {
            setIsSaving(true);
            onSave().finally(() => setIsSaving(false));
          }}
          disabled={isSaving}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 rounded text-white disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? <>Đang lưu...</> : "Lưu"}
        </button>
      </div>
    </div>
  );
};
