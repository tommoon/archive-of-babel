import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useRef, useState, useMemo, CSSProperties, forwardRef, PointerEventHandler } from "react";
import { Root, createRoot } from "react-dom/client";
import { Matrix4, Vector3 } from "three";

export type Linvel = { dx: number, dy: number }

type MobileControllerProps = {
  onChangeLeftController?: (difference: Linvel) => void, 
  onChangeRightController?: (difference: Linvel) => void, 
  inset?: number | [number, number],
  padSize?: number | [number, number],
  joystickSize?: number | [number, number],
  sensitivity?: number | [number, number],
  blockBackgroundScroll?: boolean,
  invertLook?: boolean
};

type ControlPadProps = {
  rightController: boolean,
  updateMovement: (difference: Linvel) => void,
  inset: number,
  padSize: number,
  joystickSize: number
}

const masterMatrix = new Matrix4();
const translationMatrix = new Matrix4()
const up = new Vector3(0, 1, 0)
const left = new Vector3(1, 0, 0)
const ControlPad: React.FC<ControlPadProps> = ({
  rightController, updateMovement,
  inset = 20,
  padSize = 100,
  joystickSize = 30,
}) => {
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [touchPosition, setTouchPosition] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const padRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    setIsTouching(true);
    padRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isTouching) return;
    const boundings = padRef.current?.getBoundingClientRect();
    if (!boundings) return;
    const divisor =  20
    const dx = (e.clientX - (boundings.left + boundings.width / 2)) / divisor;
    const dy = (e.clientY - (boundings.top + boundings.height / 2)) / divisor;

    // Clamping the values to ensure the circle stays within the control pad
    const dxm = Math.max(Math.min(dx, 35 / 30), -35 / 30);
    const dym = Math.max(Math.min(dy, 35 / 30), -35 / 30);

    setTouchPosition({ dx: dxm, dy: dym });
    updateMovement({ dx, dy });
  };

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (e) => {
    setIsTouching(false);
    padRef.current?.releasePointerCapture(e.pointerId);
    updateMovement({ dx: 0, dy: 0 });
    setTouchPosition({ dx: 0, dy: 0 });
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
        bottom: inset,
        ...(rightController ? { right: inset } : { left: inset }),
        width: padSize,
        height: padSize,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "50%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: joystickSize,
          height: joystickSize,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderRadius: "50%",
          transform: `translate(${touchPosition.dx * joystickSize}px, ${touchPosition.dy * joystickSize}px)`,
          transition: 'transform 0.1s',
        }}
      />
    </div>
  );
};

export const NewMobileController = forwardRef<HTMLDivElement, MobileControllerProps>(({
  onChangeLeftController,
  onChangeRightController,
  inset = 20,
  padSize = 100,
  sensitivity = 0.01,
  joystickSize = 30,
  blockBackgroundScroll = false,
  invertLook = false
},
  ref) => {

  const { gl, size, events } = useThree();
  const [el] = useState(() => document.createElement('div'));
  const root = useRef<Root>();
  const target = (events.connected || gl.domElement.parentNode) as HTMLElement;

  const [panState, setPanState] = useState<Linvel>({ dx: 0, dy: 0 })
  const [moveState, setMoveState] = useState<Linvel>({ dx: 0, dy: 0 })


  const styles: CSSProperties = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: size.width,
    height: size.height,
  }), [size.width, size.height]);

  const backgroundTouch: PointerEventHandler<HTMLDivElement> = (e) => {
    if (blockBackgroundScroll) {
      e.preventDefault();
    }
  };

  const leftControlPadFeedback = (difference: Linvel) =>  onChangeLeftController ? onChangeLeftController(difference) : setMoveState(difference)
  const rightControlPadFeedback = (difference: Linvel) =>  onChangeRightController ? onChangeRightController(difference) : setPanState(difference)

  useFrame((state) => {
    if (!onChangeLeftController) {
      const moveSensitivity = Array.isArray(sensitivity) ? sensitivity[0] : sensitivity
      masterMatrix.copy(state.camera.matrix)
      translationMatrix.makeTranslation(moveState.dx * moveSensitivity, 0, moveState.dy * moveSensitivity);
      masterMatrix.multiply(translationMatrix);
    
      state.camera.matrix.copy(masterMatrix);
      state.camera.matrix.decompose(state.camera.position, state.camera.quaternion, state.camera.scale);
    }

    if (!onChangeRightController) {
      const panSensitivity = Array.isArray(sensitivity) ? sensitivity[1] : sensitivity

      state.camera.rotateOnWorldAxis(up, panState.dx * -panSensitivity)
      state.camera.rotateOnAxis(left, panState.dy * panSensitivity * (invertLook ? 1 : -1))
    }
  });
  
  useLayoutEffect(() => {
    if (target && !root.current) {
      target.appendChild(el);
      root.current = createRoot(el);
      root.current.render(
        <div ref={ref} style={styles} onPointerMove={backgroundTouch}>
          <ControlPad
            updateMovement={leftControlPadFeedback}
            rightController={false}
            inset={Array.isArray(inset) ? inset[0] : inset}
            padSize={Array.isArray(padSize) ? padSize[0] : padSize}
            joystickSize={Array.isArray(joystickSize) ? joystickSize[0] : joystickSize}
          />
          <ControlPad
            updateMovement={rightControlPadFeedback}
            rightController={true}
            inset={Array.isArray(inset) ? inset[1] : inset}
            padSize={Array.isArray(padSize) ? padSize[1] : padSize}
            joystickSize={Array.isArray(joystickSize) ? joystickSize[1] : joystickSize}
          />
          </div>
      );
    }
  }, [target, el, ref, styles]);

  return null;
});
