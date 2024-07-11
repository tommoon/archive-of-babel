import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookState,
  gameController,
  setDebug,
} from "@/Controllers/gameController";
import { CellHex } from "@/types/CommonTypes";

export const useQueryString = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookState, cellHex, setCellHex, setBookState, debug } =
    gameController();

  useEffect(() => {
    const convertToParams = (obj: CellHex | BookState) => {
      return Object.entries(obj || {})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, value?.toString()]);
    };

    const stringifiedParams = {
      ...Object.fromEntries(convertToParams(cellHex)),
      ...Object.fromEntries(convertToParams(bookState)),
    };

    setSearchParams(stringifiedParams);
  }, [cellHex, bookState, debug, setSearchParams]);

  useEffect(() => {
    const x = searchParams.get("x");
    const y = searchParams.get("y");
    const z = searchParams.get("z");
    const cabinet = searchParams.get("cabinet");
    const unit = searchParams.get("unit");
    const row = searchParams.get("row");
    const book = searchParams.get("book");

    const debug = searchParams.get("debug");
    if (debug) {
      setDebug();
    }
    if (x && y && z) {
      setCellHex({
        x: x,
        y: y,
        z: z,
      });
    } else {
      setCellHex({ x: "0", y: "0", z: "0" });
    }

    if (cabinet || unit || row || book) {
      setBookState({
        cabinet: cabinet ? parseInt(cabinet) : undefined,
        row: row ? parseInt(row) : undefined,
        book: book ? parseInt(book) : undefined,
        unit: unit ? parseInt(unit) : undefined,
      });
    }
  }, [setCellHex, setBookState, setDebug]);
};
