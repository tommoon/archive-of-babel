import { gameController } from "@/Controllers/gameController";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";
import { Camera } from "./Camera";
import { useCellHex } from "@/hooks/useCellHex";

const SPEED = 2;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();

export const playerPos = new Vector3();

export const Player = () => {
  const ref = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();
  const { cellHex: cellHex, debug } = gameController();
  const { adjustedPosition } = useCellHex({ cellHex, addition: new Vector3(3, 2, 5)});

  const initialPosition = useMemo(() => {
    debug && console.log("positioning player");
    return adjustedPosition;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const { forward = 0, backward = 0, leftward = 0, rightward = 0 } = get();
      const velocity = ref.current.linvel();
      const rigidBodyTranslation = ref.current.translation();
      playerPos.set(
        rigidBodyTranslation.x,
        rigidBodyTranslation.y + 0.2,
        rigidBodyTranslation.z,
      );
      state.camera.position.set(
        rigidBodyTranslation.x,
        rigidBodyTranslation.y + 0.2,
        rigidBodyTranslation.z,
      );
      // @ts-ignore
      frontVector.set(0, 0, backward - forward);
      // @ts-ignore
      sideVector.set(leftward - rightward, 0, 0);
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(state.camera.rotation);
      ref.current.setLinvel(
        {
          x: direction.x,
          y: velocity.y,
          z: direction.z,
        },
        true,
      );
    }
  });

  return cellHex ? (
    <group>
      <Camera />
      <RigidBody
        canSleep={false}
        ref={ref}
        colliders={false}
        type="dynamic"
        enabledRotations={[false, false, false]}
        position={initialPosition} // Use the memoized initial position
      >
        <CapsuleCollider args={[0.2, 0.18]} />
      </RigidBody>
    </group>
  ) : null;
};
