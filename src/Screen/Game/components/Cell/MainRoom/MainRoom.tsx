import { RigidBody } from "@react-three/rapier";
import { Model as LibraryMainFloorsWalls } from "./components/LibraryMainFloorsWalls";
import { Model as LibraryMainNoColliders } from "./components/LibraryMainNoColliders";
import { Model as LibraryMainRailing } from "./components/LibraryMainRailing";
import { Model as ShelfUnit } from "./components/ShelfUnit";
import { Euler, MeshNormalMaterial, Object3D, Vector3 } from "three";
import { useLayoutEffect, useRef, useState } from "react";
import { Book } from "./components/Book";
import { useGLTF } from "@react-three/drei";
import { Books } from "./components/Books";

interface MainRoomProps {
  noColliders?: boolean;
}


export const MainRoom: React.FC<MainRoomProps> = ({ noColliders = false }) => {
  const { nodes } = useGLTF('/book-transformed.glb') as GLTFResult

const material = new MeshNormalMaterial
const [hoveredIndex,setHoveredIndex] = useState<number | undefined>(undefined)

  return (
    <group>
      <LibraryMainNoColliders />
        <Books />
      {!noColliders ? (
        <RigidBody type="kinematicPosition" colliders="hull">
          <ShelfUnit rotation={new Euler(0,Math.PI/2,0)} />
        </RigidBody>
      ) : (
          <>
    {/*       <ShelfUnit />
          <ShelfUnit rotation={new Euler(0,Math.PI,0)} />
          <ShelfUnit rotation={new Euler(0,Math.PI/2,0)} />
          <ShelfUnit rotation={new Euler(0,-Math.PI/2,0)} /> */}
          </>
      )}
      {!noColliders ? (
        <RigidBody type="kinematicPosition" colliders="trimesh">
          <LibraryMainFloorsWalls />
        </RigidBody>
      ) : (
        <LibraryMainFloorsWalls />
      )}
      {!noColliders ? (
        <RigidBody type="kinematicPosition" colliders="hull">
          <LibraryMainRailing />
        </RigidBody>
      ) : (
        <LibraryMainRailing />
      )}
    </group>
  );
};
useGLTF.preload('/book-transformed.glb')
