import { RigidBody } from "@react-three/rapier";
import { Model as LibraryMainFloorsWalls } from "./components/LibraryMainFloorsWalls";
import { Model as LibraryMainNoColliders } from "./components/LibraryMainNoColliders";
import { Model as LibraryMainRailing } from "./components/LibraryMainRailing";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Box3 } from "three";

export const MainRoom = ({ position }) => {
  const mainRoomRef = useRef(undefined);

  useEffect(() => {
    if (mainRoomRef.current) {
      let bb = new Box3().setFromObject(mainRoomRef.current);
    }
  }, [mainRoomRef]);
  return (
    <group ref={mainRoomRef}>
      <LibraryMainNoColliders />
      <RigidBody type="fixed" colliders="trimesh">
        <LibraryMainFloorsWalls />
      </RigidBody>
      <RigidBody type="fixed" colliders="hull">
        <LibraryMainRailing />
      </RigidBody>
    </group>
  );
};
