import {
  useKeyboardControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import { Vector3 } from "three";

const SPEED = 3;
const direction = new Vector3();
const frontVector = new Vector3();
const sideVector = new Vector3();

export const playerPos = new Vector3()
export const Player = () => {
  const ref = useRef();

  const [, get] = useKeyboardControls()
  
  useFrame((state) => {
    if (ref.current) { 
      const { forward, backward, leftward, rightward } = get();
      const velocity = ref.current.linvel()
      const rigidBodyTranslation = ref.current.translation()
      playerPos.set(rigidBodyTranslation.x,rigidBodyTranslation.y + 0.2 ,rigidBodyTranslation.z)
      state.camera.position.set(rigidBodyTranslation.x,rigidBodyTranslation.y + 0.2 ,rigidBodyTranslation.z)
      frontVector.set(0, 0,  backward - forward)
      sideVector.set(leftward - rightward, 0, 0)
      direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation);
      ref.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z })
    }
  })


  return (
        <RigidBody
          ref={ref}
          colliders={false}
          mass={1}
          type="dynamic"
          enabledRotations={[false, false, false]}
          position={[0, 2, -2]}
        >
          <CapsuleCollider args={[0.25, 0.1]} />
        </RigidBody>
  );
};
