import { Sphere } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { RigidBody } from "@react-three/rapier";
import { LibraryMainRoom } from "./LibraryMainRoom";
import { LibraryCorridor } from "./LibraryCorridor";
import { LibraryStairs } from "./LibraryStairs";
import { MainRoom } from "./MainRoom/MainRoom";

export const Cell = ({ position }) => {
  return (
    <group position={position}>
      <MainRoom position={new Vector3(0, 0, 0)} />
      <LibraryCorridor position={new Vector3(5.5, 0, 0)} />
      <LibraryCorridor position={new Vector3(-5.5, 0, 0)} />
      <LibraryCorridor
        rotation={new Euler(0, Math.PI / 2, 0)}
        position={new Vector3(0, 0, 5.5)}
      />
      <LibraryCorridor
        rotation={new Euler(0, Math.PI / 2, 0)}
        position={new Vector3(0, 0, -5.5)}
      />
    </group>
  );
};
