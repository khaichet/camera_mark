"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCamera } from "@/app/hooks/useCamera";
import { useSettings } from "@/app/context/SettingsContext";
import { useAuth } from "@/app/context/AuthContext";
import { SettingsProvider } from "@/app/context/SettingsContext";
import { TopBar } from "@/app/components/TopBar";
import { BottomBar } from "@/app/components/BottomBar";
import { GridOverlay } from "@/app/components/GridOverlay";
import { SettingsModal } from "@/app/components/SettingsModal";
import { CapturePreview } from "@/app/components/CapturePreview";
import { savePhotoCaptured } from "@/lib/photoUpload";

function CameraContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const {
    videoRef,
    canvasRef,
    isStreaming,
    capturedImage,
    setCapturedImage,
    capturePhoto,
  } = useCamera();
  const [showSettings, setShowSettings] = useState(false);

  const { timeFormat, gpsEnabled, companyLogo } = useSettings();

  const [addressInfo, setAddressInfo] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (gpsEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
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
      currentTime,
      userName: user?.name || user?.username || "",
      companyLogo,
      timeFormat,
    });
  };

  const handleSavePhoto = async () => {
    if (!capturedImage) return;

    try {
      const result = await savePhotoCaptured(
        capturedImage,
        `photo_${Date.now()}.png`,
        "camera",
        user?.id
      );
      console.log("Ảnh đã lưu thành công:", result);

      alert(`Lưu ảnh thành công!\nURL: ${result.data.url}`);

      setCapturedImage(null);
    } catch (error) {
      console.error("Lỗi lưu ảnh:", error);
      alert(
        "Lỗi lưu ảnh: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  if (authLoading) {
    return (
      <div className="relative h-screen w-full bg-black text-white overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

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
