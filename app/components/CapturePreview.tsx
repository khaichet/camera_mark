"use client";

interface CapturePreviewProps {
  image: string;
  onRetake: () => void;
  onSave: () => void;
}

export const CapturePreview: React.FC<CapturePreviewProps> = ({
  image,
  onRetake,
  onSave,
}) => {
  return (
    <div className="absolute inset-0 z-30 bg-black/90 flex flex-col items-center justify-center">
      <div className="relative">
        <img
          src={image}
          alt="Captured"
          className="max-h-[70vh] max-w-full rounded"
        />
        <img
          src="/asset/logo.png"
          alt="Logo"
          className="absolute top-2 right-2 h-8 w-auto"
        />
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={onRetake}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Chụp lại
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};
