"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { LogOut } from "lucide-react";
import {
  Camera,
  MapPin,
  Clock,
  Shield,
  ChevronRight,
  ImageIcon,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "orange" | "purple";
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    green:
      "from-green-500/20 to-green-600/10 border-green-500/30 text-green-400",
    orange:
      "from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400",
    purple:
      "from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400",
  };

  const iconBgClasses = {
    blue: "bg-blue-500/20",
    green: "bg-green-500/20",
    orange: "bg-orange-500/20",
    purple: "bg-purple-500/20",
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${colorClasses[color]} border`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg ${iconBgClasses[color]} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-medium text-slate-900 text-sm">{title}</h3>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleStartCamera = () => {
    router.push("/camera");
  };

  const handleViewPhotos = () => {
    router.push("/camera/photos");
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-900 overflow-y-auto flex flex-col">
      {/* Top Bar with User Info */}
      <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white shadow-sm">
        <div>
          {user && (
            <>
              <p className="text-xs text-slate-500">Người dùng</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                {user.name || user.username}
              </p>
            </>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors text-xs sm:text-sm text-slate-900"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>

      {/* Logo Section */}
      <div className="flex justify-center items-center px-3 sm:px-6 py-3 sm:py-6">
        <Image
          src="/asset/logo.png"
          alt="Hupuna Logo"
          width={120}
          height={48}
          priority
          className="h-auto w-auto sm:w-[200px]"
        />
      </div>

      {/* Features */}
      <div className="flex-1 px-3 sm:px-6 py-2">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-800">
          Tính năng
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <FeatureCard
            icon={<Camera className="w-5 h-5" />}
            title="Chụp ảnh nhanh"
            description="Chụp ảnh với giao diện camera chuyên nghiệp"
            color="blue"
          />
          <FeatureCard
            icon={<MapPin className="w-5 h-5" />}
            title="Gắn vị trí GPS"
            description="Tự động ghi lại địa chỉ và tọa độ GPS"
            color="green"
          />
          <FeatureCard
            icon={<Clock className="w-5 h-5" />}
            title="Dấu thời gian"
            description="Thêm ngày giờ chụp ảnh tự động"
            color="orange"
          />
        </div>
      </div>

      <div className="px-3 sm:px-6 py-2">
        <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-200">
          <h3 className="text-xs sm:text-sm font-semibold text-amber-900 mb-2">
            💡 Mẹo nhanh
          </h3>
          <ul className="text-xs sm:text-sm text-amber-800 space-y-1">
            <li>• Cho phép quyền truy cập camera và vị trí</li>
            <li>• Giữ điện thoại ổn định khi chụp</li>
            <li>• Chỉnh sửa watermark trong cài đặt</li>
          </ul>
        </div>
      </div>

      <div className="px-3 sm:px-6 py-4 sm:py-6 space-y-2 sm:space-y-3 pb-6 sm:pb-8">
        <button
          onClick={handleStartCamera}
          className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 shadow-lg shadow-blue-500/25 active:scale-[0.98]"
        >
          <Camera className="w-5 sm:w-6 h-5 sm:h-6" />
          <span className="hidden sm:inline">Bắt đầu chụp ảnh</span>
          <span className="sm:hidden">Chụp ảnh</span>
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        <button
          onClick={handleViewPhotos}
          className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 bg-slate-200 hover:bg-slate-300 border border-slate-300 rounded-lg sm:rounded-xl font-medium flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 active:scale-[0.98] text-slate-900 text-sm sm:text-base"
        >
          <ImageIcon className="w-4 sm:w-5 h-4 sm:h-5" />
          <span className="hidden sm:inline">Xem ảnh đã chụp</span>
          <span className="sm:hidden">Xem ảnh</span>
        </button>
      </div>
    </div>
  );
}
