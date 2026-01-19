"use client";

import { Settings, MapPinned, Undo2 } from "lucide-react";

interface TopBarProps {
  onSettingsClick: () => void;
  onLogoutClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onSettingsClick,
  onLogoutClick,
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pt-10">
      <button
        onClick={onSettingsClick}
        className="p-2 rounded-full hover:bg-white/10 transition"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      <button className="flex flex-col items-center gap-1 group">
        <div className="p-2 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-yellow-500/20 transition">
          <MapPinned className="w-5 h-5 text-yellow-400" />
        </div>
      </button>

      <button
        onClick={onLogoutClick}
        className="p-2 rounded-full hover:bg-white/10 transition"
        title="Quay lại"
      >
        <Undo2 className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};
