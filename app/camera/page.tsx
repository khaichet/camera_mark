import {
  Camera,
  Image,
  MapPinned,
  Stamp,
  Settings,
  SwitchCamera,
  ZapOff,
} from "lucide-react";

export default function CameraInterface() {
  return (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 bg-gray-900">
        <div className="w-full h-full object-cover opacity-50 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Camera Feed Preview</span>
        </div>
      </div>

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

        <button className="relative group transition-transform active:scale-95">
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
    </div>
  );
}
