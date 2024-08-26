import { CellHex } from "@/types/CommonTypes";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

const cellHexToBinary = (cellHex: CellHex) =>
  Object.values(cellHex)
    .map((cell) => {
      if (cell.startsWith("-")) {
        return "0";
      }
      return "1";
    })
    .join("");

export const roomsToSenary = (cellHex: CellHex) => {
  const binary = cellHexToBinary(cellHex);
  return parseInt(binary, 2);
};

export const senaryToRooms = (
  senaryNumber: number,
  cellHex: CellHex
): CellHex => {
  const cellKeys = Object.keys(cellHex) as (keyof CellHex)[];
  const numCells = cellKeys.length;
  const binary = senaryNumber.toString(2).padStart(numCells, "0");

  const updatedCellHex: CellHex = { ...cellHex };
  binary.split("").forEach((bit, index) => {
    if (bit === "0") {
      updatedCellHex[cellKeys[index]] = "-" + updatedCellHex[cellKeys[index]];
    } else {
      updatedCellHex[cellKeys[index]] = updatedCellHex[cellKeys[index]];
    }
  });
  return updatedCellHex;
};

export const getBase10FromString = ({
  string,
  base = 10,
}: {
  string: string;
  base?: number;
}) => parseInt(string, base);

export const pad = (
  input: string,
  length: number,
  char: string,
  reverse: boolean = false
) => {
  return reverse ? input.padEnd(length, char) : input.padStart(length, char);
};

export const randPad = (input: string, length: number, characters: string) => {
  // Function to generate a random character from the characters string
  const getRandomChar = () =>
    characters[Math.floor(Math.random() * characters.length)];

  // Calculate how much padding is needed
  const padLength = length - input.length;

  // If no padding is needed, return the input as is
  if (padLength <= 0) {
    return input;
  }

  // Generate a random string of characters for padding
  const generateRandomString = (len: number) =>
    Array.from({ length: len }, getRandomChar).join("");

  // Randomly decide how much padding to add to the start and end
  const startPadLength = Math.floor(Math.random() * padLength);
  const endPadLength = padLength - startPadLength;

  // Generate padding strings
  const startPadding = generateRandomString(startPadLength);
  const endPadding = generateRandomString(endPadLength);

  // Return the string with random padding added to both sides
  return startPadding + input + endPadding;
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
