import { BookState, gameController } from "@/Controllers/gameController";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import { Euler, Quaternion, Vector3 } from "three";
import { useCellHex } from "@/hooks/useCellHex";
import { degrees_to_radians } from "@/lib/utils";
import { touchController } from "@/Controllers/touchController";

const SPEED = 2;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();
const startPos = new Vector3(3, 1, 5);
export const playerPos = new Vector3();

const getStartingPos = (bookState: BookState | undefined) => {
  if (!bookState) return startPos;
  switch (bookState.cabinet) {
    case 0:
      return new Vector3(1.6, 1, 1.6);
    case 1:
      return new Vector3(4.4, 1, 1.6);
    case 2:
      return new Vector3(4.4, 1, 4.4);
    case 3:
      return new Vector3(1.6, 1, 4.4);
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

export const Player = () => {
  const ref = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();
  const { cellHex, bookState } = gameController();
  const { move, pan } = touchController();
  const { adjustedPosition } = useCellHex({ cellHex, addition: getStartingPos(bookState) });
  const initialPosition = useInitialPosition(bookState, adjustedPosition);

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
      frontVector.set(0, 0, backward - forward + move.dy * 0.01);
      // @ts-ignore
      sideVector.set(leftward - rightward - move.dx * 0.01, 0, 0);
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
      const tiltQuat = new Quaternion().setFromEuler(new Euler(pan.dy * -0.01, 0, 0));
      state.camera.rotateOnWorldAxis(new Vector3(0,1,0),pan.dx * -0.01)
      state.camera.quaternion.multiply(tiltQuat)
    }
  });

  return cellHex ? (
    <group>
      {/* <Camera initialRotation={initialRotation} /> */}
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
