import { gameController } from "@/Controllers/gameController";
import { Plane, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { PlaneGeometry, Vector3 } from "three";
import { Camera } from "./Camera";

const SPEED = 2;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();

export const playerPos = new Vector3();
export const Player = () => {
  const ref = useRef();

  const [, get] = useKeyboardControls();
  const { setPlayerPosition } = gameController();

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
      ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
    }
  });

  /*   useEffect(() => {
    const interval = setInterval(() => {
      const z = Math.floor(playerPos.z / 11);
      const x = Math.floor(playerPos.x / 11);
      setPlayerPosition({ x, y: 0, z });
    }, 1000);

    return () => clearInterval(interval);
  }, []); */

  return (
    <group>
      <Camera />
      <RigidBody
        canSleep={false}
        ref={ref}
        colliders={false}
        type="dynamic"
        enabledRotations={[false, false, false]}
        position={[3, 1, 5]}
      >
        <CapsuleCollider args={[0.2, 0.18]} />
      </RigidBody>
    </group>
  );
};
