import { gameController } from "@/Controllers/gameController";
import { Plane, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { PlaneGeometry, Vector3 } from "three";
import { Camera } from "./Camera";
import { CellLocation } from "@/types/CommonTypes";

const SPEED = 2;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();

export const playerPos = new Vector3();

const getInitialPosition = (playerPosition: CellLocation) =>
  new Vector3(
    playerPosition.x * 11,
    playerPosition.y * 2,
    playerPosition.z * 11,
  ).add(new Vector3(3, 2, 5));

export const Player = () => {
  const ref = useRef();
  const [, get] = useKeyboardControls();
  const { playerPosition } = gameController();

  const initialPosition = useMemo(
    () => playerPosition && getInitialPosition(playerPosition),
    [],
  );

  useFrame((state) => {
    if (ref.current) {
      const { forward, backward, leftward, rightward } = get();
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
      frontVector.set(0, 0, backward - forward);
      sideVector.set(leftward - rightward, 0, 0);
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .multiplyScalar(SPEED)
        .applyEuler(state.camera.rotation);
      ref.current.setLinvel({
        x: direction.x,
        y: velocity.y,
        z: direction.z,
      });
    }
  });

  return playerPosition ? (
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
