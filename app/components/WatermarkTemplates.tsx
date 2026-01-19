"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";

export interface WatermarkTemplate {
  id: string;
  name: string;
  description: string;
  style: WatermarkStyle;
  preview: string;
}

export interface WatermarkStyle {
  layout:
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-right"
    | "center"
    | "bottom-center";
  theme:
    | "classic"
    | "modern"
    | "minimal"
    | "elegant"
    | "bold"
    | "neon"
    | "vintage"
    | "professional";
  showTime: boolean;
  showDate: boolean;
  showAddress: boolean;
  showUsername: boolean;
  showLogo: boolean;
  showCoordinates: boolean;
  fontSize: "small" | "medium" | "large";
  fontFamily: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  shadowEnabled: boolean;
  borderEnabled: boolean;
  backgroundBlur: boolean;
}

export const watermarkTemplates: WatermarkTemplate[] = [
  {
    id: "classic",
    name: "Cổ điển",
    description: "Hiển thị đầy đủ thời gian, địa chỉ và logo",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    style: {
      layout: "bottom-left",
      theme: "classic",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: true,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "Arial",
      primaryColor: "#FFFFFF",
      secondaryColor: "#F59E0B",
      accentColor: "#F59E0B",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "modern",
    name: "Hiện đại",
    description: "Thiết kế tối giản với đường viền gradient",
    preview: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    style: {
      layout: "bottom-right",
      theme: "modern",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: true,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "Segoe UI",
      primaryColor: "#FFFFFF",
      secondaryColor: "#38ef7d",
      accentColor: "#11998e",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "minimal",
    name: "Tối giản",
    description: "Chỉ hiển thị thời gian và ngày",
    preview: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
    style: {
      layout: "bottom-left",
      theme: "minimal",
      showTime: true,
      showDate: true,
      showAddress: false,
      showUsername: false,
      showLogo: false,
      showCoordinates: false,
      fontSize: "large",
      fontFamily: "Helvetica",
      primaryColor: "#FFFFFF",
      secondaryColor: "#3498db",
      accentColor: "#2c3e50",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "elegant",
    name: "Thanh lịch",
    description: "Phong cách sang trọng với font chữ đẹp",
    preview: "linear-gradient(135deg, #C9B037 0%, #D4AF37 50%, #AA8C2C 100%)",
    style: {
      layout: "bottom-center",
      theme: "elegant",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: true,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "Georgia",
      primaryColor: "#FFFFFF",
      secondaryColor: "#D4AF37",
      accentColor: "#C9B037",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "bold",
    name: "Đậm nét",
    description: "Chữ lớn, dễ đọc, nổi bật",
    preview: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
    style: {
      layout: "bottom-left",
      theme: "bold",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: true,
      showCoordinates: true,
      fontSize: "large",
      fontFamily: "Impact",
      primaryColor: "#FFFFFF",
      secondaryColor: "#e74c3c",
      accentColor: "#c0392b",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "neon",
    name: "Neon",
    description: "Hiệu ứng phát sáng neon",
    preview: "linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)",
    style: {
      layout: "bottom-right",
      theme: "neon",
      showTime: true,
      showDate: true,
      showAddress: false,
      showUsername: true,
      showLogo: true,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "Courier New",
      primaryColor: "#00ffff",
      secondaryColor: "#ff00ff",
      accentColor: "#ffff00",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "vintage",
    name: "Cổ điển",
    description: "Phong cách hoài cổ, ấm áp",
    preview: "linear-gradient(135deg, #8B4513 0%, #D2691E 100%)",
    style: {
      layout: "bottom-left",
      theme: "vintage",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: false,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "Times New Roman",
      primaryColor: "#F5DEB3",
      secondaryColor: "#D2691E",
      accentColor: "#8B4513",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "professional",
    name: "Chuyên nghiệp",
    description: "Phù hợp cho công việc, dự án",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    style: {
      layout: "bottom-left",
      theme: "professional",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: true,
      showCoordinates: true,
      fontSize: "small",
      fontFamily: "Roboto",
      primaryColor: "#FFFFFF",
      secondaryColor: "#4A90D9",
      accentColor: "#2C5F8D",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "dark",
    name: "Tối",
    description: "Nền tối, chữ sáng tinh tế",
    preview: "linear-gradient(135deg, #0f0f0f 0%, #232526 100%)",
    style: {
      layout: "bottom-right",
      theme: "modern",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: false,
      showLogo: true,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "SF Pro",
      primaryColor: "#E0E0E0",
      secondaryColor: "#888888",
      accentColor: "#555555",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "sunrise",
    name: "Bình minh",
    description: "Màu sắc ấm áp như bình minh",
    preview: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    style: {
      layout: "bottom-left",
      theme: "modern",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: true,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "Poppins",
      primaryColor: "#FFFFFF",
      secondaryColor: "#ff6b6b",
      accentColor: "#feca57",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "ocean",
    name: "Đại dương",
    description: "Màu xanh biển sâu",
    preview: "linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)",
    style: {
      layout: "bottom-center",
      theme: "elegant",
      showTime: true,
      showDate: true,
      showAddress: true,
      showUsername: true,
      showLogo: true,
      showCoordinates: true,
      fontSize: "medium",
      fontFamily: "Lato",
      primaryColor: "#FFFFFF",
      secondaryColor: "#00b4d8",
      accentColor: "#0077b6",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
  {
    id: "forest",
    name: "Rừng xanh",
    description: "Màu xanh tự nhiên, tươi mát",
    preview: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    style: {
      layout: "top-left",
      theme: "modern",
      showTime: true,
      showDate: true,
      showAddress: false,
      showUsername: true,
      showLogo: true,
      showCoordinates: false,
      fontSize: "medium",
      fontFamily: "Open Sans",
      primaryColor: "#FFFFFF",
      secondaryColor: "#71b280",
      accentColor: "#134e5e",
      shadowEnabled: true,
      borderEnabled: false,
      backgroundBlur: false,
    },
  },
];

interface WatermarkTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: WatermarkTemplate) => void;
  currentTemplateId?: string;
}

export const WatermarkTemplatesModal: React.FC<
  WatermarkTemplatesModalProps
> = ({ isOpen, onClose, onSelectTemplate, currentTemplateId }) => {
  const [selectedId, setSelectedId] = useState<string>(
    currentTemplateId || "classic",
  );

  if (!isOpen) return null;

  const handleSelect = (template: WatermarkTemplate) => {
    setSelectedId(template.id);
    onSelectTemplate(template);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-gray-900 rounded-t-3xl max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            Chọn mẫu Watermark
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-2 gap-3">
            {watermarkTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={`relative p-3 rounded-xl transition-all duration-200 ${
                  selectedId === template.id
                    ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900"
                    : "hover:scale-105"
                }`}
              >
                {/* Preview Background */}
                <div
                  className="w-full h-24 rounded-lg mb-2 flex items-end justify-start p-2 relative overflow-hidden"
                  style={{ background: template.preview }}
                >
                  {/* Mini preview elements */}
                  <div className="text-left">
                    {template.style.showTime && (
                      <div
                        className="font-bold text-xs"
                        style={{ color: template.style.primaryColor }}
                      >
                        12:30
                      </div>
                    )}
                    {template.style.showDate && (
                      <div
                        className="text-[8px] opacity-80"
                        style={{ color: template.style.primaryColor }}
                      >
                        19/01/2026
                      </div>
                    )}
                    {template.style.showAddress && (
                      <div
                        className="text-[6px] opacity-60 truncate max-w-[80px]"
                        style={{ color: template.style.primaryColor }}
                      >
                        123 Đường ABC...
                      </div>
                    )}
                  </div>

                  {/* Selected indicator */}
                  {selectedId === template.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Theme indicator */}
                  {template.style.borderEnabled && (
                    <div
                      className="absolute inset-0 rounded-lg border-2"
                      style={{ borderColor: template.style.accentColor }}
                    />
                  )}
                </div>

                {/* Template Info */}
                <div className="text-left">
                  <h3 className="text-white font-medium text-sm">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-1">
                    {template.description}
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {template.style.showTime && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded">
                      Giờ
                    </span>
                  )}
                  {template.style.showAddress && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded">
                      Địa chỉ
                    </span>
                  )}
                  {template.style.showLogo && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded">
                      Logo
                    </span>
                  )}
                  {template.style.showCoordinates && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-700 text-gray-300 rounded">
                      GPS
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition"
          >
            Xác nhận
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WatermarkTemplatesModal;
