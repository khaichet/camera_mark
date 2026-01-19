"use client";

import { X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useSettings } from "@/app/context/SettingsContext";
import { useAuth } from "@/app/context/AuthContext";

export const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [addressInfo, setAddressInfo] = useState<{
    houseNumber?: string;
    street?: string;
    ward?: string;
    district?: string;
    province?: string;
    country?: string;
    displayName?: string;
  } | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const { timeFormat, setTimeFormat, gpsEnabled, setGpsEnabled } =
    useSettings();

  const { user } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString("vi-VN"));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gpsEnabled && isOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
            setLocationError("");

            setLoadingAddress(true);
            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  "Accept-Language": "vi",
                },
              },
            )
              .then((res) => res.json())
              .then((data) => {
                const addr = data.address || {};

                const newAddress = {
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
                  displayName: data.display_name || "",
                };

                setAddressInfo(newAddress);
                setLoadingAddress(false);
              })
              .catch((error) => {
                console.error("Error fetching address:", error);
                setLoadingAddress(false);
              });
          },
          (error) => {
            setLocationError("Không thể lấy vị trí: " + error.message);
            setCurrentLocation(null);
            setAddressInfo(null);
          },
        );
      } else {
        setLocationError("Trình duyệt không hỗ trợ Geolocation");
      }
    }
  }, [gpsEnabled, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-white/20 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Cấu hình nội dung</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-4">
              Thông tin hiện tại
            </h3>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Thời gian hiện tại:</p>
              <p className="text-white font-semibold">{currentTime}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Địa điểm hiện tại:</p>
              {gpsEnabled ? (
                currentLocation ? (
                  <div className="text-white font-semibold space-y-2">
                    {loadingAddress ? (
                      <p className="text-yellow-400 text-sm">
                        Đang tải địa chỉ...
                      </p>
                    ) : addressInfo ? (
                      <div className="space-y-1 text-sm">
                        {addressInfo.houseNumber && (
                          <p>
                            <span className="text-gray-400">Số nhà: </span>
                            {addressInfo.houseNumber}
                          </p>
                        )}
                        {addressInfo.street && (
                          <p>
                            <span className="text-gray-400">Đường: </span>
                            {addressInfo.street}
                          </p>
                        )}
                        {addressInfo.ward && (
                          <p>
                            <span className="text-gray-400">Phường: </span>
                            {addressInfo.ward}
                          </p>
                        )}
                        {addressInfo.district && (
                          <p>
                            <span className="text-gray-400">Quận: </span>
                            {addressInfo.district}
                          </p>
                        )}
                        {addressInfo.province && (
                          <p>
                            <span className="text-gray-400">
                              Tỉnh/Thành phố:{" "}
                            </span>
                            {addressInfo.province}
                          </p>
                        )}
                        {addressInfo.country && (
                          <p>
                            <span className="text-gray-400">Quốc gia: </span>
                            {addressInfo.country}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-yellow-400 text-sm">
                        Không thể tải thông tin địa chỉ
                      </p>
                    )}
                  </div>
                ) : locationError ? (
                  <p className="text-red-400 text-sm">{locationError}</p>
                ) : (
                  <p className="text-yellow-400 text-sm">Đang lấy vị trí...</p>
                )
              ) : (
                <p className="text-gray-400 text-sm">GPS đã tắt</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vị trí (Location/GPS)
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGpsEnabled(!gpsEnabled)}
                className={`w-12 h-6 rounded-full transition ${
                  gpsEnabled ? "bg-blue-500" : "bg-gray-600"
                } flex items-center ${
                  gpsEnabled ? "justify-end" : "justify-start"
                } p-1`}
              >
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </button>
              <span className="text-gray-300">
                {gpsEnabled ? "Bật" : "Tắt"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tên người chụp (User Name)
            </label>
            <p className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white font-medium">
              {user?.name || user?.username || "Chưa đăng nhập"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-medium transition mt-6"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};
