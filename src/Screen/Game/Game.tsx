import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Vector3 } from "three";
import { Player } from "./SubComponents/Player";
import { KeyboardControls, OrbitControls, PointerLockControls } from "@react-three/drei";
import { Cell } from "./SubComponents/Cell";

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
  return (
    <KeyboardControls map={keyboardMap}>
    <Canvas shadows>
      <Suspense>
        <ambientLight />
        <directionalLight />
        <Physics debug>
          <Player />
          <Cell position={new Vector3(0, 0, 0)} />
        </Physics>
        </Suspense>
        <PointerLockControls />
      </Canvas>
      </KeyboardControls>
  );
};
