import { RigidBody } from "@react-three/rapier";
import { Model as LibraryMainFloorsWalls } from "./components/LibraryMainFloorsWalls";
import { Model as LibraryMainNoColliders } from "./components/LibraryMainNoColliders";
import { Model as LibraryMainRailing } from "./components/LibraryMainRailing";
import { useGLTF } from "@react-three/drei";
import { cellLocation } from "@/types/CommonTypes";
import { Shelves } from "./components/Shelves";
import { useEffect, useRef } from "react";

interface MainRoomProps {
  noColliders?: boolean;
  playerPosition?: cellLocation;
}

export const MainRoom: React.FC<MainRoomProps> = ({
  noColliders = false,
  playerPosition,
}) => 
     {  const testref = useRef()
  useEffect(() => {
    if(testref.current)
        console.log("test",testref.current.translation())
  }, [testref])
  
    return (<group>
    <LibraryMainNoColliders />
    {playerPosition &&
      [0, 1, 2, 3].map((rotation) => (
        <Shelves
          key={rotation}
          rotationDegrees={rotation}
          cellLocation={playerPosition}
        />
      ))}
    {!noColliders ? (
      <RigidBody ref={testref} type="fixed" colliders="trimesh">
        <LibraryMainFloorsWalls />
      </RigidBody>
    ) : (
      <LibraryMainFloorsWalls />
    )}
    {!noColliders ? (
      <RigidBody type="fixed" colliders="hull">
        <LibraryMainRailing />
      </RigidBody>
    ) : (
      <LibraryMainRailing />
    )}
  </group>)
  }
useGLTF.preload("/book-transformed.glb");
