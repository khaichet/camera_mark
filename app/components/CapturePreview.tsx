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
      <img
        src={image}
        alt="Captured"
        className="max-h-[70vh] max-w-full rounded"
      />
      <div className="flex gap-4 mt-6">
        <button
          onClick={onRetake}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Retake
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
};
