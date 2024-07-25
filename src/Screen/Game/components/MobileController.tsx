import { touchController } from "@/Controllers/touchController";
import { PointerEventHandler, useRef, useState } from "react";

interface ControlPadProps {
  pan: boolean;
}

const ControlPad: React.FC<ControlPadProps> = ({ pan }) => {
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const padRef = useRef<HTMLDivElement | null>(null);
  const { updateMovement } = touchController();

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    setIsTouching(true);
    padRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isTouching) return;
    const boundings = padRef.current?.getBoundingClientRect();
    if (!boundings) return;
    const dx = (e.clientX - (boundings.left + boundings.width / 2)) / 30;
    const dy = (e.clientY - (boundings.top + boundings.height / 2)) / 30;

    updateMovement(pan ? 'pan' : 'move', { dx, dy });
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (e) => {
    setIsTouching(false);
    padRef.current?.releasePointerCapture(e.pointerId);
    updateMovement(pan ? 'pan' : 'move', { dx: 0, dy: 0 });
  };

  return (
    <div
      ref={padRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
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
