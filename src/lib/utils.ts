import { CellHex } from "@/types/CommonTypes";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MeshBasicMaterial } from "three";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Define a function named degrees_to_radians that converts degrees to radians.
export function degrees_to_radians(degrees: number) {
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi / 180);
}

export const transparentMaterial = new MeshBasicMaterial({
  transparent: true,
  opacity: 0,
});

const cellHexToBinary = (cellHex: CellHex) =>
  Object.values(cellHex)
    .map((cell) => {
      if (cell > 0) {
        return 1;
      }
      return 0;
    })
    .join("");

export const roomsToSenary = (cellHex: CellHex) => {
  const binary = cellHexToBinary(cellHex);
  return parseInt(binary, 6);
};

export const getBase10FromString = ({
  string,
  base = 10,
}: {
  string: string;
  base?: number;
}) => parseInt(string, base);

export const pad = (input: string, length: number, char: string) => {
  return input.padEnd(length, char);
};

export const hashCode = (s: string) => {
  let hash = 0,
    i,
    chr,
    len;
  if (s.length == 0) return hash;
  for (i = 0, len = s.length; i < len; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};
