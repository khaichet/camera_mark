"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

interface Photo {
  _id: string;
  fileUrl: string;
  fileName: string;
  userId: string;
  createdAt: string;
}

const AlbumPhoto = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    if (user?.id) {
      fetchPhotos();
    }
  }, [user?.id]);

  const fetchPhotos = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/photos/list?userId=${user.id}`);
      const result = await response.json();
      if (result.success) {
        setPhotos(result.data || []);
        setError(null);
      } else {
        setError(result.message || "Không thể lấy danh sách ảnh");
        setPhotos([]);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Lỗi không xác định";
      console.error("Lỗi lấy danh sách ảnh:", error);
      setError("Lỗi kết nối: " + errorMessage);
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    // Vuốt sang trái (swipe left) - xem ảnh tiếp theo
    if (diff > swipeThreshold && selectedIndex < photos.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedPhoto(photos[nextIndex]);
    }
    // Vuốt sang phải (swipe right) - xem ảnh trước đó
    else if (diff < -swipeThreshold) {
      if (selectedIndex > 0) {
        const prevIndex = selectedIndex - 1;
        setSelectedIndex(prevIndex);
        setSelectedPhoto(photos[prevIndex]);
      } else {
        // Không có ảnh trước, trở về camera
        setSelectedPhoto(null);
        router.push("/camera");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 flex flex-col">
      <div className="flex items-center gap-4 mb-6 pt-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Thư viện ảnh</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 text-lg">Đang tải ảnh...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={fetchPhotos}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 text-lg">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-5 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {photos.map((photo, index) => (
              <div
                key={photo._id}
                className="relative group rounded-lg overflow-hidden bg-gray-900 cursor-pointer"
                onClick={() => {
                  setSelectedPhoto(photo);
                  setSelectedIndex(index);
                }}
              >
                <img
                  src={photo.fileUrl}
                  alt={photo.fileName}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-3">
                  <div className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-medium line-clamp-1">{photo.fileName}</p>
                    <p className="text-gray-300">{photo.createdAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onTouchStart={(e) => {
            touchStartX.current = e.changedTouches[0].screenX;
          }}
          onTouchEnd={(e) => {
            touchEndX.current = e.changedTouches[0].screenX;
            handleSwipe();
          }}
        >
          <img
            src={selectedPhoto.fileUrl}
            alt={selectedPhoto.fileName}
            className="w-full h-full object-contain"
          />

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
            <div>
              <p className="text-sm font-medium">{selectedPhoto.fileName}</p>
              <p className="text-xs text-gray-300">{selectedPhoto.createdAt}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-lg transition z-10"
          >
            <X size={30} className="text-white" />
          </button>

          {/* Hướng dẫn vuốt */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm text-center opacity-70">
            <p>← Vuốt để xem ảnh khác →</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumPhoto;
