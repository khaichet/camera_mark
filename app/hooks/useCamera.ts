"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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
  capturePhoto: () => void;
  addWatermarkToImage: (
    imageData: string,
    config: {
      addressInfo?: AddressInfo | null;
      currentLocation?: CurrentLocation | null;
      currentTime?: string;
      userName?: string;
      companyLogo?: string | null;
      timeFormat?: string;
    }
  ) => Promise<string>;
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImageState] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Đảm bảo video play trên Safari
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.log("Auto-play handled by autoPlay attribute");
        }
        setIsStreaming(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Custom setCapturedImage để xử lý camera stream
  const setCapturedImage = useCallback((image: string | null) => {
    setCapturedImageState(image);
    
    // Khi đóng preview (image = null), restart camera stream
    if (image === null) {
      // Delay một chút để đảm bảo DOM đã sẵn sàng
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [startCamera]);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);

        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImageState(imageData);
      }
    }
  };

  const addWatermarkToImage = async (
    imageData: string,
    config: {
      addressInfo?: AddressInfo | null;
      currentLocation?: CurrentLocation | null;
      currentTime?: string;
      userName?: string;
      companyLogo?: string | null;
      timeFormat?: string;
    }
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          await drawWatermark(tempCanvas, {
            addressInfo: config.addressInfo || null,
            currentLocation: config.currentLocation || null,
            currentTime: config.currentTime || new Date().toLocaleString("vi-VN"),
            userName: config.userName || "",
            timeFormat: config.timeFormat || "DD/MM/YYYY HH:mm",
          });
          resolve(tempCanvas.toDataURL("image/png"));
        }
      };
      img.src = imageData;
    });
  };

  return {
    videoRef,
    canvasRef,
    isStreaming,
    capturedImage,
    setCapturedImage,
    capturePhoto,
    addWatermarkToImage,
  };
};
