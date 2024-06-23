import { Euler } from "three";
import { Model as ShelfUnit } from "./ShelfUnit";
import { cellLocation } from "@/types/CommonTypes";
import { degrees_to_radians } from "@/lib/utils";
import { RigidBody } from "@react-three/rapier";
import { Books } from "./Books";

interface ShelvesProps {
  rotationDegrees: number;
  cellLocation: cellLocation;
}
export const Shelves: React.FC<ShelvesProps> = ({
  rotationDegrees,
  cellLocation,
}) => {
  return (
    <group rotation={new Euler(0, degrees_to_radians(rotationDegrees * 90), 0)}>
      <RigidBody type="fixed" colliders={"hull"}>
        <ShelfUnit />
      </RigidBody>
      <Books cellLocation={cellLocation} shelfIndex={rotationDegrees} />
    </group>
  );
};
