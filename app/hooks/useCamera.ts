"use client";

import { useRef, useEffect, useState } from "react";
import { drawWatermark } from "@/app/utils/watermark";

interface AddressInfo {
  street?: string;
  ward?: string;
  district?: string;
  province?: string;
  country?: string;
}

interface CurrentLocation {
  latitude: number;
  longitude: number;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
  capturedImage: string | null;
  setCapturedImage: (image: string | null) => void;
  capturePhoto: (config?: {
    addressInfo?: AddressInfo | null;
    currentLocation?: CurrentLocation | null;
    currentTime?: string;
    userName?: string;
    companyLogo?: string | null;
    timeFormat?: string;
  }) => void;
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = (config?: {
    addressInfo?: AddressInfo | null;
    currentLocation?: CurrentLocation | null;
    currentTime?: string;
    userName?: string;
    companyLogo?: string | null;
    timeFormat?: string;
  }) => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        // Vẽ watermark nếu có config
        if (config) {
          drawWatermark(canvasRef.current, {
            addressInfo: config.addressInfo || null,
            currentLocation: config.currentLocation || null,
            currentTime: config.currentTime || new Date().toLocaleString("vi-VN"),
            userName: config.userName || "",
            companyLogo: config.companyLogo || null,
            timeFormat: config.timeFormat || "DD/MM/YYYY HH:mm",
          });
        }

        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
      }
    }
  };

  return {
    videoRef,
    canvasRef,
    isStreaming,
    capturedImage,
    setCapturedImage,
    capturePhoto,
  };
};
