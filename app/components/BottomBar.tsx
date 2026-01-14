"use client";

import { useState } from "react";
import { Camera, Image, Stamp, X } from "lucide-react";

interface BottomBarProps {
  onCaptureClick: () => void;
  capturedPhotos?: string[];
}

export const BottomBar: React.FC<BottomBarProps> = ({
  onCaptureClick,
  capturedPhotos = [],
}) => {
  const [showGallery, setShowGallery] = useState(false);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pb-10 pt-20 px-8 flex justify-between items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <button
        className="group flex flex-col items-center gap-2"
        onClick={() => setShowGallery(true)}
      >
        <div className="w-12 h-12 rounded-lg bg-gray-800 border-2 border-white/20 overflow-hidden group-hover:border-white transition flex items-center justify-center backdrop-blur-sm">
          <Image className="w-6 h-6 text-gray-300" />
        </div>
      </button>

      <button
        className="relative group transition-transform active:scale-95"
        onClick={onCaptureClick}
      >
        <div className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent shadow-lg">
          <div className="w-16 h-16 rounded-full bg-white group-hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Camera className="w-8 h-8 text-black opacity-80" />
          </div>
        </div>
      </button>

      <button className="group flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition border border-white/10">
          <Stamp className="w-6 h-6 text-white" />
        </div>
      </button>

      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl">Ảnh đã chụp</h2>
            <button
              onClick={() => setShowGallery(false)}
              className="p-2 hover:bg-gray-800 rounded transition"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {capturedPhotos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-lg">Chưa có ảnh nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 overflow-y-auto">
              {capturedPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-80 transition"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
