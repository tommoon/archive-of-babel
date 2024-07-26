import { BookState } from "@/Controllers/gameController";
import { CellHex } from "@/types/CommonTypes";
import { x86 as MurmurHash3 } from "murmurhash3js";
import { hashCode, pad, roomsToSenary, senaryToRooms } from "./utils";

export function seededRandom(seed: string): number {
  const hash = MurmurHash3.hash32(seed);
  // Use hash to generate a number between 0 and 1
  const randomNumber = (Math.abs(hash) % 1000000) / 1000000;
  return randomNumber;
}

// Define a type for the LCG function
type LCGRandom = (min?: number, max?: number) => number;

function createLCG(seedString: string): LCGRandom {
  const initialHash = MurmurHash3.hash32(seedString);
  let seed = Math.abs(initialHash);
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;

  return (min: number = 0, max: number = 1): number => {
    seed = (a * seed + c) % m;
    const normalized = seed / m;
    return min + normalized * (max - min);
  };
}

const characters = "abcdefghijklmnopqrstuvwxyz, .!?'";

const modulus = (t: number, n: number): number => {
  return ((t % n) + n) % n;
};

const normalizeCell = (cell: CellHex): CellHex => {
  const normalizedCell: CellHex = { ...cell };

  (Object.keys(normalizedCell) as (keyof CellHex)[]).forEach((key) => {
    normalizedCell[key] = normalizedCell[key].replace("-", "");
  });

  return normalizedCell;
};

const makeTextBlock = (cell: string, startingValue: string): string => {
  let result = "";
  const lcg = createLCG(startingValue);
  for (let i = 0; i < cell.split("").length; i++) {
    const index = parseInt(cell[i], 32);
    const rand = lcg(0, characters.length);
    const newIndex = modulus(index - Math.floor(rand), characters.length);
    const newChar = characters[newIndex];
    result += newChar;
  }
  const newHash = hashCode(result);
  const newLcg = createLCG(newHash.toString());
  while (result.length < 1000) {
    const index = newLcg(0, characters.length);
    result += characters[Math.floor(index)];
  }
  return result;
};

const makeHex = (blockString: string, seed: string): string => {
  const lcg = createLCG(seed);
  return blockString
    .split("")
    .map((subString: string) => {
      const index = characters.indexOf(subString);
      const rand = lcg(0, characters.length);
      const newIndex = modulus(index + Math.floor(rand), characters.length);
      return newIndex.toString(32);
    })
    .join("");
};

export function generateSeededText(
  page: number,
  bookCell: CellHex,
  bookLocation: BookState
): string {
  const negativeStates = roomsToSenary(bookCell);
  const locHash = hashCode(
    `${bookLocation.cabinet}${bookLocation.unit}${bookLocation.row}${
      bookLocation.book
    }${pad(page.toString(), 3, "0")}${negativeStates}`
  );

  const normalizedCell = normalizeCell(bookCell);

  const text = Object.values(normalizedCell)
    .map((cellNumber, index) => {
      const text = makeTextBlock(
        cellNumber.toString(),
        locHash.toString() + index
      );
      return text;
    })
    .join("");

  return text;
}

export const findText = (searchString: string) => {
  const cabinet = Math.floor(Math.random() * 4).toString();
  const unit = Math.floor(Math.random() * 4).toString();
  const row = Math.floor(Math.random() * 4).toString();
  const book = Math.floor(Math.random() * 10).toString();
  const page = pad(Math.floor(Math.random() * 410 + 1).toString(), 3, "0");
  const negativeState = Math.floor(Math.random() * 7);
  const locHash = hashCode(cabinet + unit + row + book + page + negativeState);

  const fullString = pad(searchString, 3000, " ", true);
  const newCellHex = { x: "", y: "", z: "" };
  (Object.keys(newCellHex) as (keyof CellHex)[]).forEach((cell, i) => {
    const pos = i * 1000;
    const blockString = fullString.slice(pos, pos + 1000);
    const fullHex = makeHex(blockString, locHash.toString() + i);
    newCellHex[cell] = fullHex;
  });
  return {
    ...senaryToRooms(negativeState, newCellHex),
    book: book,
    cabinet: cabinet,
    row: row,
    unit: unit,
    page: page,
  };
};
