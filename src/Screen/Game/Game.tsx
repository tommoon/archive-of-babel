import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Player } from "./components/Player";
import { KeyboardControls, PointerLockControls } from "@react-three/drei";
import { Cells } from "./Cells";
import { locationController } from "@/Controllers/locationController";
import { Vector3 } from "three";

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
  const { playerPosition, debug } = locationController();

  return (
    <KeyboardControls map={keyboardMap}>
      <div className="fixed z-10 p-4 bg-white/100">{`x:${playerPosition.x}, y: ${playerPosition.y}, z: ${playerPosition.z}`}</div>
      <Canvas shadows>
      <color attach="background" args={["black"]} />
        <Suspense>
          <ambientLight />
          <directionalLight />
          {!debug && <fogExp2 attach={'fog'} args={['black', 0.1]} />}
          <Physics debug={debug}>
            <Player />
            <group position={new Vector3(3, 0, 3)}>
              <Cells />
            </group>
          </Physics>
        </Suspense>
        <PointerLockControls />
      </Canvas>
      <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-2 border-white"></div>
    </KeyboardControls>
  );
};
