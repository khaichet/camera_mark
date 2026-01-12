"use client";

interface GridOverlayProps {
  isVisible?: boolean;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
  isVisible = true,
}) => {
  if (!isVisible) return null;

  return (
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
  );
};
