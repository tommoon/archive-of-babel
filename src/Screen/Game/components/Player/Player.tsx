import { BookState, gameController } from "@/Controllers/gameController";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useLayoutEffect, useMemo, useRef } from "react";
import { Euler, Quaternion, Vector3 } from "three";
import { Camera } from "./Camera";
import { useCellHex } from "@/hooks/useCellHex";
import { degrees_to_radians } from "@/lib/utils";

const SPEED = 2;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const startPos = new Vector3(3, 2, 5);
export const playerPos = new Vector3();

const getStartingPos = (bookState: BookState | undefined) => {
  if (!bookState) return startPos;
  switch (bookState.cabinet) {
    case 0:
      return new Vector3(1.6, 2, 1.6);
    case 1:
      return new Vector3(4.4, 2, 1.6);
    case 2:
      return new Vector3(4.4, 2, 4.4);
    case 3:
      return new Vector3(1.6, 2, 4.4);
    default:
      return startPos;
  }
};

const getRoomRotation = (cabinet: number | undefined) => {
  switch (cabinet) {
    case 0:
      return 45;
    case 1:
      return 315;
    case 2:
      return 225;
    case 3:
      return 135;
    default:
      return 0;
  }
};

const useInitialPosition = (bookState: BookState | undefined, adjustedPosition: Vector3) => {
  return useMemo(() => {
    if (!bookState) return adjustedPosition;
    let unitAdjustment = 0;
    if (bookState.unit !== undefined) {
      if (bookState.cabinet === 0) {
        unitAdjustment = bookState.unit - 2;
      } else {
        unitAdjustment = 2 - bookState.unit;
      }
    }
    const quat = new Quaternion().setFromEuler(new Euler(0, degrees_to_radians(getRoomRotation(bookState.cabinet)), 0));
    const vector = new Vector3(unitAdjustment * 0.447, 0, 0).applyQuaternion(quat);
    return adjustedPosition.clone().add(vector);
  }, []);
};

const useInitialRotation = (bookState: BookState | undefined) => {
  return useMemo(() => {
    if (!bookState) return new Euler(0, 0, 0);
    let y = getRoomRotation(bookState?.cabinet);
    if (bookState?.book !== undefined) {
      let starting = 15 - (bookState.book * 3.3);
      y += starting;
    }
    // Initial Y-axis rotation
    const initialQuat = new Quaternion().setFromEuler(new Euler(0, degrees_to_radians(y), 0));
    const initialRotation = new Euler().setFromQuaternion(initialQuat);

    // Check if we need to tilt the camera down
    if (bookState.row !== undefined) {
      // Apply a local rotation of -10 degrees around the X-axis
      const rowDegrees = -32 + (bookState.row * 16)
      const tiltQuat = new Quaternion().setFromEuler(new Euler(degrees_to_radians(rowDegrees), 0, 0));
      initialQuat.multiplyQuaternions(initialQuat, tiltQuat);
      initialRotation.setFromQuaternion(initialQuat);
    }

    return initialRotation;
  }, [bookState]);
};

export const Player = () => {
  const ref = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();
  const { cellHex, bookState, debug } = gameController();
  const { adjustedPosition } = useCellHex({ cellHex, addition: getStartingPos(bookState) });
  const initialPosition = useInitialPosition(bookState, adjustedPosition);
  const initialRotation = useInitialRotation(bookState);

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
      <Camera initialRotation={initialRotation} />
      <RigidBody
        canSleep={false}
        ref={ref}
        colliders={false}
        type="dynamic"
        enabledRotations={[false, false, false]}
        position={initialPosition}
      >
        <CapsuleCollider args={[0.2, 0.18]} />
      </RigidBody>
    </group>
  ) : null;
};
