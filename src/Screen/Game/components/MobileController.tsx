import { touchController } from "@/Controllers/touchController";
import { useRef, useState } from "react";

const ControlPad:React.FC<{pan:boolean}> = ({ pan }) => {
  const [touchStart, setTouchStart] = useState(null);
  const padRef = useRef<{x:number, y:number} | null>(null);
    const {updateMovement} = touchController()
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;

    updateMovement(pan ? 'pan' : 'move', {dx, dy});

    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    updateMovement(pan ? 'pan' : 'move', {dx: 0, dy: 0});
  };

  return (
    <div
      ref={padRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "absolute",
        bottom: 20,
        ...pan ? { right: 20 } : { left: 20 },
        width: 100,
        height: 100,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "50%",
      }}
    />
  );
};

export const MobileController = () => {
  return (
    <div className="flex w-full fixed inset-x-0 bottom-0 p-10">
      <ControlPad pan={false} />
      <ControlPad pan={true} />
    </div>
  );
};
