"use client";

import { useState, useEffect } from "react";
import { useCamera } from "@/app/hooks/useCamera";
import { useSettings } from "@/app/context/SettingsContext";
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

  const { timeFormat, gpsEnabled, userName, companyLogo } = useSettings();

  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [addressInfo, setAddressInfo] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    if (gpsEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setCurrentTime(new Date().toLocaleString("vi-VN"));

        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          { headers: { "Accept-Language": "vi" } }
        )
          .then((res) => res.json())
          .then((data) => {
            const addr = data.address || {};
            setAddressInfo({
              houseNumber: addr.house_number || addr.housenumber || "",
              street: addr.road || addr.pedestrian || addr.path || "",
              ward:
                addr.suburb ||
                addr.quarter ||
                addr.neighbourhood ||
                addr.village ||
                addr.hamlet ||
                "",
              district: addr.district || addr.county || addr.town || "",
              province: addr.city || addr.state || "",
              country: addr.country || "",
            });
          });
      });
    }
  }, [gpsEnabled]);

  const handleCaptureWithWatermark = () => {
    capturePhoto({
      addressInfo,
      currentLocation,
      currentTime,
      userName,
      companyLogo,
      timeFormat,
    });
  };

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

      <BottomBar onCaptureClick={handleCaptureWithWatermark} />

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
