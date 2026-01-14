"use client";

import { useState, useRef } from "react";
import { Cropper } from "react-advanced-cropper";
import { X, Scissors } from "lucide-react";
import "react-advanced-cropper/dist/style.css";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  onCropComplete,
  onCancel,
}) => {
  const cropperRef = useRef<any>(null);

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas();
      const croppedImage = canvas.toDataURL("image/png");
      onCropComplete(croppedImage);
    }
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h2 className="text-white text-xl mb-4">Cắt ảnh</h2>
        <div
          className="bg-black rounded overflow-hidden mb-4"
          style={{ height: "500px" }}
        >
          <Cropper
            ref={cropperRef}
            src={image}
            stencilProps={{
              handlers: true,
              lines: true,
              movable: true,
              resizable: true,
            }}
            style={{ height: "100%" }}
          />
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white flex items-center gap-2"
          >
            <X size={18} />
          </button>
          <button
            onClick={handleCrop}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white flex items-center gap-2"
          >
            <Scissors size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
