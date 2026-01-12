"use client";

import { useState } from "react";
import { useCamera } from "@/app/hooks/useCamera";
import { SettingsProvider } from "@/app/context/SettingsContext";
import { TopBar } from "@/app/components/TopBar";
import { BottomBar } from "@/app/components/BottomBar";
import { GridOverlay } from "@/app/components/GridOverlay";
import { SettingsModal } from "@/app/components/SettingsModal";
import { CapturePreview } from "@/app/components/CapturePreview";

function CameraContent() {
  const {
    videoRef,
    canvasRef,
    isStreaming,
    capturedImage,
    setCapturedImage,
    capturePhoto,
  } = useCamera();
  const [showSettings, setShowSettings] = useState(false);

  const handleSavePhoto = () => {
    console.log("Image saved:", capturedImage);
  };

  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div
        className="absolute inset-0 z-0 bg-gray-900"
        style={{ display: isStreaming ? "none" : "block" }}
      ></div>

      <TopBar onSettingsClick={() => setShowSettings(true)} />

      <BottomBar onCaptureClick={capturePhoto} />

      <GridOverlay />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {capturedImage && (
        <CapturePreview
          image={capturedImage}
          onRetake={() => setCapturedImage(null)}
          onSave={handleSavePhoto}
        />
      )}
    </div>
  );
}

export default function CameraInterface() {
  return (
    <SettingsProvider>
      <CameraContent />
    </SettingsProvider>
  );
}
