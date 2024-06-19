import { Euler, Vector3 } from "three";
import { LibraryStairSet } from "./LibraryStairSet";
import { useMemo } from "react";
import { cellLocation } from "@/types/CommonTypes";

interface StairSetProps {
  position: cellLocation;
}

export const LibraryStairs: React.FC<StairSetProps> = ({ position }) => {
  return (
    <>
    <group>
      <LibraryStairSet position={position} />
      <LibraryStairSet position={position} horizontal />
      </group>
      </>
  );
};
