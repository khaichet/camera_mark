"use client";

import { useRouter } from "next/navigation";
import { Camera, Image, Stamp } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  WatermarkTemplatesModal,
  WatermarkTemplate,
  watermarkTemplates,
} from "./WatermarkTemplates";

interface BottomBarProps {
  onCaptureClick: () => void;
  capturedPhotos?: string[];
  onTemplateChange?: (template: WatermarkTemplate) => void;
}

interface Photo {
  _id: string;
  fileUrl: string;
  fileName: string;
  userId: string;
  createdAt: string;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  onCaptureClick,
  capturedPhotos = [],
  onTemplateChange,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [latestPhoto, setLatestPhoto] = useState<Photo | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<WatermarkTemplate>(
    watermarkTemplates[0],
  );

  useEffect(() => {
    if (user?.id) {
      fetchLatestPhoto();
    }
  }, [user?.id]);

  const fetchLatestPhoto = async () => {
    try {
      const response = await fetch(`/api/photos/list?userId=${user?.id}`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        setLatestPhoto(result.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pb-24 pt-20 px-8 flex justify-between items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
      <button
        className="group flex flex-col items-center gap-2"
        onClick={() => router.push("/camera/photos")}
      >
        <div className="w-12 h-12 rounded-lg bg-gray-800 border-2 border-white/20 overflow-hidden group-hover:border-white transition flex items-center justify-center backdrop-blur-sm">
          {latestPhoto ? (
            <img
              src={latestPhoto.fileUrl}
              alt="Latest"
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="w-6 h-6 text-gray-300" />
          )}
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

      <button
        className="group flex flex-col items-center gap-2"
        onClick={() => setShowTemplates(true)}
      >
        <div
          className="w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition border border-white/10 overflow-hidden"
          style={{ background: currentTemplate.preview }}
        >
          <Stamp className="w-6 h-6 text-white drop-shadow-md" />
        </div>
      </button>

      {/* Watermark Templates Modal */}
      <WatermarkTemplatesModal
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        currentTemplateId={currentTemplate.id}
        onSelectTemplate={(template) => {
          setCurrentTemplate(template);
          onTemplateChange?.(template);
        }}
      />
    </div>
  );
};
