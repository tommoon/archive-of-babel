import { touchController } from "@/Controllers/touchController";
import { TouchEventHandler, useRef, useState } from "react";

interface ControlPadProps {
  pan: boolean;
}

const ControlPad: React.FC<ControlPadProps> = ({ pan }) => {
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const padRef = useRef<HTMLDivElement | null>(null);
  const { updateMovement } = touchController();

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = () => {
    setIsTouching(true);
  };

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isTouching) return;
    const boundings = padRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (!boundings) return;
    const dx = (touch.clientX - (boundings.left + boundings.width / 2)) / 30;
    const dy = (touch.clientY - (boundings.top + boundings.height / 2)) / 30;

    updateMovement(pan ? 'pan' : 'move', { dx, dy });
  };

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = () => {
    setIsTouching(false);
    updateMovement(pan ? 'pan' : 'move', { dx: 0, dy: 0 });
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
        ...(pan ? { right: 20 } : { left: 20 }),
        width: 100,
        height: 100,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "50%",
      }}
    />
  );
};

export const MobileController: React.FC = () => {
  return (
    <div className="flex w-full fixed inset-x-0 bottom-0 p-10">
      <ControlPad pan={false} />
      <ControlPad pan={true} />
    </div>
  );
};
