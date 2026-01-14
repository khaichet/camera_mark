"use client";

import { useState } from "react";
import { ImageCropper } from "./ImageCropper";
import { DrawingCanvas } from "./DrawingCanvas";
import { X, Scissors, Pen, Check } from "lucide-react";

interface ImageEditorProps {
  image: string;
  onComplete: (editedImage: string) => void;
  onCancel: () => void;
}

type EditStep = "preview" | "crop" | "draw";

export const ImageEditor: React.FC<ImageEditorProps> = ({
  image,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<EditStep>("preview");
  const [workingImage, setWorkingImage] = useState(image);

  const handleCropComplete = (croppedImage: string) => {
    setWorkingImage(croppedImage);
    setCurrentStep("preview");
  };

  const handleDrawComplete = (drawnImage: string) => {
    onComplete(drawnImage);
  };

  return (
    <>
      {currentStep === "preview" && (
        <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="max-w-2xl">
            <h2 className="text-white text-xl mb-4 text-center">
              Chỉnh sửa ảnh
            </h2>
            <div className="relative mb-6 flex justify-center">
              <img
                src={workingImage}
                alt="Preview"
                className="max-h-[60vh] max-w-full rounded"
              />
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white flex items-center gap-2"
              >
                <X size={18} />
              </button>

              <button
                onClick={() => setCurrentStep("crop")}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white flex items-center gap-2"
              >
                <Scissors size={18} />
              </button>
              <button
                onClick={() => setCurrentStep("draw")}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 rounded text-white flex items-center gap-2"
              >
                <Pen size={18} />
              </button>
              <button
                onClick={() => onComplete(workingImage)}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-white flex items-center gap-2"
              >
                <Check size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === "crop" && (
        <ImageCropper
          image={workingImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setCurrentStep("preview")}
        />
      )}

      {currentStep === "draw" && (
        <DrawingCanvas
          image={workingImage}
          onDrawComplete={handleDrawComplete}
          onCancel={() => setCurrentStep("preview")}
        />
      )}
    </>
  );
};
