import { useEffect, useMemo, useRef, useState } from "react";
import { LibraryCorridor } from "./Corridor/LibraryCorridor";
import { cellLocation as CellLocation } from "@/types/CommonTypes";
import { Box3, Vector3 } from "three";
import { playerPos } from "../Player";
import { MainRoom } from "./MainRoom/MainRoom";
import { locationController } from "@/Controllers/locationController";
import { _objectIsEqual } from "@/lib/comparisons";
import { Text } from "@react-three/drei";

interface CellProps {
  position: CellLocation;
  noColliders?: boolean;
  noExtras?: boolean;
}

export const Cell: React.FC<CellProps> = ({
  position,
  noColliders = false,
  noExtras = false,
}) => {
  const cellRef = useRef();
  const { playerPosition, setPlayerPosition, debug } = locationController();

  const adjustedPosition = useMemo(
    () => new Vector3(position.x * 11, position.y * 2, position.z * 11),
    [position],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (cellRef.current) {
        const bb = new Box3().setFromObject(cellRef.current);
        const inside = bb.containsPoint(playerPos);
        if (inside && !_objectIsEqual(position, playerPosition)) {
          console.log(position, playerPosition, inside);
          setPlayerPosition(position);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cellRef, playerPosition, position]);

  return noExtras ? (
    <group position={adjustedPosition}>
      <MainRoom noColliders />
    </group>
  ) : (
    <group ref={cellRef} position={adjustedPosition}>
      {debug && (
        <Text position={new Vector3(0, 1, 0)}>
          {`${position.x}_${position.y}_${position.z}`}
          <meshNormalMaterial />
        </Text>
      )}
      <MainRoom noColliders={noColliders} />
      <LibraryCorridor noColliders={noColliders} corridor="N" />
      <LibraryCorridor noColliders={noColliders} corridor="E" />
      <group position={new Vector3(0, -2, 0)}>
        <MainRoom noColliders />
        <LibraryCorridor noColliders corridor="N" />
        <LibraryCorridor noColliders corridor="E" />
      </group>
      <group position={new Vector3(0, 2, 0)}>
          <MainRoom noColliders />
          <LibraryCorridor noColliders corridor="N" />
          <LibraryCorridor noColliders corridor="E" />
      </group>
    </group>
  );
};
