import { useMemo } from "react";
import { Vector3 } from "three";

const verticalAdjustment: Record<string, number> = {
  N: 5.5,
  S: -5.5,
  E: 0,
  W: 0,
};

const horizontalAdjustment: Record<string, number> = {
  E: -5.5,
  W: 5.5,
  S: 0,
  N: 0,
};

type CellLocation = {
  x: number;
  y: number;
  z: number;
};

type Orientation = "N" | "S" | "E" | "W";

type UseCellLocationProps = {
  cellLocation: CellLocation;
  orientation?: Orientation;
};

export const useCellLocation = ({
  cellLocation,
  orientation,
}: UseCellLocationProps) => {
  const adjustedPosition = useMemo(
    () =>
      orientation
        ? new Vector3(
            cellLocation.x * 11 + horizontalAdjustment[orientation],
            cellLocation.y * 2,
            cellLocation.z * 11 + verticalAdjustment[orientation]
          )
        : new Vector3(
            cellLocation.x * 11,
            cellLocation.y * 2,
            cellLocation.z * 11
          ),
    [cellLocation, orientation]
  );

  return {
    adjustedPosition: adjustedPosition,
    isVertical: orientation && ["N", "S"].includes(orientation),
  };
};
