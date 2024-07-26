import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect, useRef } from "react";
import { Player } from "./components/Player/Player";
import { KeyboardControls, PointerLockControls, useDetectGPU } from "@react-three/drei";
import { gameController } from "@/Controllers/gameController";
import { Vector3 } from "three";
import { BookInterior } from "./components/BookInterior/BookInterior";
import { Cell } from "./components/Cell/Cell";
import { useQueryString } from "@/hooks/useQueryString";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";
import { MobileController } from "./components/MobileController";
import { optionsController } from "@/Controllers/optionsController";
import { loadFromLocalStorage } from "@/lib/localStorage";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

export const Game = () => {
  const { cellHex, debug, bookOpen } = gameController();
  const canvasRef = useRef(null)
  useQueryString();

  const pointerLockRef = useRef<PointerLockControlsImpl>(null);
  const { screenLocked } = gameController();
  const { dynamicLights, setDynamicLights, setIsMobile, isMobile } = optionsController();
  const GPUTier = useDetectGPU();

  useEffect(() => {
    if (!loadFromLocalStorage('dynamicLights')) {
      console.log('dynamic load')

      setDynamicLights(false)
    }
    if (!loadFromLocalStorage('isMobile')) {
      console.log('dynamic load')
      setIsMobile(GPUTier.isMobile !== undefined && GPUTier.isMobile)
    }
  }, [GPUTier])
  
  useEffect(() => {
      if (pointerLockRef.current) {
        if (screenLocked) {
          setTimeout(() => {
            pointerLockRef.current?.unlock();
          }, 10);
        } else if (!screenLocked && !pointerLockRef.current.isLocked) {
          setTimeout(() => {
            pointerLockRef.current?.lock();
          }, 10);
        }
      }
  }, [screenLocked]);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (canvasElement) {
      disableBodyScroll(canvasElement);
    }
    return () => {
      if (canvasElement) {
        enableBodyScroll(canvasElement);
      }
    };
  }, [canvasRef]);
  
  return (
    cellHex && (
      <KeyboardControls map={keyboardMap}>
        {debug && (
          <div className="fixed z-10 p-4 bg-white/100">{`x:${cellHex.x}, y: ${cellHex.y}, z: ${cellHex.z}`}</div>
        )}
        <Canvas ref={canvasRef} frameloop="demand">
          <color attach="background" args={["black"]} />
            {!dynamicLights && <>
              <ambientLight />
              <directionalLight />
            </>}
            {!debug && <fogExp2 attach={"fog"} args={["black", 0.1]} />}
            <Physics debug={debug}>
              <group position={new Vector3(3, 0, 3)}>
                <Cell />
              </group>
              <Player />
            </Physics>
          <PointerLockControls ref={pointerLockRef} />
        </Canvas>
        <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div>
        {bookOpen && <BookInterior />}
        {isMobile && <MobileController />}
      </KeyboardControls>
    )
  );
};
