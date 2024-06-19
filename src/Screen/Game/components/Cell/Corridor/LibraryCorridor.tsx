import { RigidBody } from "@react-three/rapier";
import { Model as LibraryCorridorDoors } from "./components/LibraryCorridorDoors";
import { Model as LibraryCorridorNoColliders } from "./components/LibraryCorridorNoColliders";
import { Model as LibraryCorridorWalls } from "./components/LibraryCorridorWalls";
import { Orientation } from "@/types/CommonTypes";
import { Euler, Vector3 } from "three";

interface LibraryCorridorProps {
  corridor: Orientation;
  noColliders?: boolean;
}
export const LibraryCorridor: React.FC<LibraryCorridorProps> = ({
  corridor,
  noColliders = false,
}) => {
  return (
    <group
      position={
        ["N", "S"].includes(corridor)
          ? new Vector3(0, 0, corridor === "N" ? -5.5 : 5.5)
          : new Vector3(corridor === "E" ? -5.5 : 5.5, 0, 0)
      }
      rotation={
        ["N", "S"].includes(corridor)
          ? new Euler(0, Math.PI / 2, 0)
          : new Euler(0, 0, 0)
      }
    >
      <LibraryCorridorNoColliders />
      {!noColliders ? (
        <RigidBody type="fixed" colliders="trimesh">
          <LibraryCorridorDoors />
        </RigidBody>
      ) : (
        <LibraryCorridorDoors />
      )}
      {!noColliders ? (
        <RigidBody type="fixed" colliders="trimesh">
          <LibraryCorridorWalls />
        </RigidBody>
      ) : (
        <LibraryCorridorWalls />
      )}
    </group>
  );
};
