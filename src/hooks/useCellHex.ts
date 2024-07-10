import { base32ToBigInt } from "@/lib/base32Utils";
import { nullVector3 } from "@/lib/positions";
import { CellHex } from "@/types/CommonTypes";
import { useMemo } from "react";
import { Vector3 } from "three";

const scaleBackLargeHexToNumber = (hex: string) => {
  const isNegative = hex.startsWith("-");
  const absHex = isNegative ? hex.slice(1) : hex;
  const bigIntNumber = base32ToBigInt(absHex);
  const number = Number(BigInt.asUintN(8, bigIntNumber));
  return isNegative ? -Math.abs(number) : number;
};

type Orientation = "N" | "S" | "E" | "W";

type UseCellHexProps = {
  cellHex: CellHex;
  orientation?: Orientation;
  addition?: Vector3;
};

export const useCellHex = ({
  cellHex,
  addition = nullVector3,
}: UseCellHexProps) => {
  const adjustedPosition = useMemo(
    () =>
      new Vector3(
        scaleBackLargeHexToNumber(cellHex.x) * 11,
        scaleBackLargeHexToNumber(cellHex.y) * 2,
        scaleBackLargeHexToNumber(cellHex.z) * 11
      ).add(addition),
    [cellHex, addition]
  );
  return {
    adjustedPosition,
  };
};
