"use client";

import {
  Camera,
  Image,
  MapPinned,
  Stamp,
  Settings,
  SwitchCamera,
  ZapOff,
} from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function CameraInterface() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/png");
        setCapturedImage(imageData);
      }
    }
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

      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pt-10">
        <button className="p-2 rounded-full hover:bg-white/10 transition">
          <Settings className="w-6 h-6 text-white" />
        </button>

        <button className="flex flex-col items-center gap-1 group">
          <div className="p-2 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-yellow-500/20 transition">
            <MapPinned className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-[10px] font-medium opacity-80 shadow-black drop-shadow-md">
            Location On
          </span>
        </button>

        <button className="p-2 rounded-full hover:bg-white/10 transition">
          <ZapOff className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 pb-10 pt-20 px-8 flex justify-between items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <button className="group flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-gray-800 border-2 border-white/20 overflow-hidden group-hover:border-white transition flex items-center justify-center backdrop-blur-sm">
            <Image className="w-6 h-6 text-gray-300" />
          </div>
        </button>

        <button
          className="relative group transition-transform active:scale-95"
          onClick={capturePhoto}
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
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3">
          <div className="border-r border-b border-white"></div>
          <div className="border-r border-b border-white"></div>
          <div className="border-b border-white"></div>
          <div className="border-r border-b border-white"></div>
          <div className="border-r border-b border-white"></div>
          <div className="border-b border-white"></div>
          <div className="border-r border-white"></div>
          <div className="border-r border-white"></div>
          <div></div>
        </div>
      </div>

      {capturedImage && (
        <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center">
          <img
            src={capturedImage}
            alt="Captured"
            className="max-h-[70vh] max-w-full rounded"
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setCapturedImage(null)}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
            >
              Retake
            </button>
            <button
              onClick={() => {
                // Handle saving/sending the image
                console.log("Image saved:", capturedImage);
              }}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
