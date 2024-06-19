import { Model as LibraryStairsNoColliders } from "./components/LibraryStairsNoColliders";
import { Model as LibraryStairsFloors } from "./components/LibraryStairsFloors";
import { Model as LibraryStairsWalls } from "./components/LibraryStairsWalls";
import { Box3, Euler, Vector3 } from "three";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import { locationController } from "@/Controllers/locationController";
import { playerPos } from "../../Player";
import { cellLocation } from "@/types/CommonTypes";

type FloorProps = {
  position: cellLocation;
  colliders?: boolean;
  horizontal?: boolean;
};

const ZVector = new Vector3(0, 0, -5.5);
const XVector = new Vector3(-5.5, 0, 0);
const Floor: React.FC<FloorProps> = ({ position, horizontal }) => {
  const adjustedPosition = useMemo(
    () => new Vector3(position.x * 11, position.y * 2, position.z * 11),
    [position],
  );
  return (
    <group position={adjustedPosition.clone().add(horizontal? XVector : ZVector)} rotation={horizontal ? new Euler(0,-Math.PI/2,0) : new Euler(0,0,0)}>
      <LibraryStairsNoColliders />
      <RigidBody type="fixed" colliders="trimesh">
        <LibraryStairsFloors />
        <LibraryStairsWalls />
      </RigidBody>
    </group>
  );
};

type LibraryStairSetProps = {
  position: cellLocation;
  horizontal?: boolean;
};
export const LibraryStairSet: React.FC<LibraryStairSetProps> = ({
  position,
  horizontal
}) => {
  const { playerPosition, setPlayerPosition } = locationController();
  const setRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      if (setRef?.current) {
        const wholeBoundingBox = new Box3().setFromObject(setRef.current);
        const upstairsBBox = wholeBoundingBox.clone().set(new Vector3(wholeBoundingBox.min.x,wholeBoundingBox.max.y - 2, wholeBoundingBox.min.z),wholeBoundingBox.max)
        const downstairsBBox = wholeBoundingBox.clone().set(wholeBoundingBox.min,new Vector3(wholeBoundingBox.max.x,wholeBoundingBox.min.y + 2, wholeBoundingBox.max.z))
        const upstairs = upstairsBBox.containsPoint(playerPos);
        const downstairs = downstairsBBox.containsPoint(playerPos);
        if (upstairs) {
          setPlayerPosition({...position,y: position.y + 1});
          console.log("upstairs");
        }
        if (downstairs) {
          setPlayerPosition({...position,y: position.y - 1});
          console.log("downstairs");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ playerPosition]);

  return (
    <group ref={setRef}>
      {[ 0, 1,2].map((floor) => (
        <Floor
          horizontal={horizontal}
          position={{ ...position, y: position.y + floor }}
          key={`stair-${position.x}-${position.y + floor}-${position.z}`}
        />
      ))}
    </group>
  );
};
