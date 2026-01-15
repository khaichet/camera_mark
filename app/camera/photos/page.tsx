"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
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

  useEffect(() => {
    if (user?.id) {
      fetchPhotos();
    }
  }, [user?.id]);

  const fetchPhotos = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/photos/list?userId=${user.id}`);
      const result = await response.json();
      if (result.success) {
        setPhotos(result.data || []);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách ảnh:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pt-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-white text-2xl font-bold">Thư viện ảnh</h1>
      </div>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 text-lg">Đang tải ảnh...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-400 text-lg">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className="relative group rounded-lg overflow-hidden bg-gray-900"
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
      )}
    </div>
  );
};

export default AlbumPhoto;
