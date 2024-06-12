import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { Vector3 } from "three";
import { Player } from "./SubComponents/Player";

export const Game = () => {
  return (
    <Canvas
      shadows
      camera={{
        position: new Vector3(-5, 5, 0),
        fov: 65,
        near: 0.1,
        far: 1000,
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") {
          (e.target as HTMLCanvasElement).requestPointerLock();
        }
      }}
    >
      <Suspense>
        <Physics>
          <group position={new Vector3(-2.5, 3, 1)}>
            <Player />
          </group>
        </Physics>
      </Suspense>
    </Canvas>
  );
};
