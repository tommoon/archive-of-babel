import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BookState,
  gameController,
  setDebug,
  setScreenLocked,
} from "@/Controllers/gameController";
import { CellHex, Orientation } from "@/types/CommonTypes";

export const useQueryString = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    bookState,
    cellHex,
    page,
    painting,
    searchString,
    setPainting,
    setCellHex,
    setBookState,
    setBookOpen,
    setPage,
    setSearchstring,
    debug,
  } = gameController();

  useEffect(() => {
    const convertToParams = (obj: CellHex | BookState) => {
      return Object.entries(obj || {})
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, value?.toString()]);
    };

    const stringifiedParams = {
      ...Object.fromEntries(convertToParams(cellHex)),
      ...Object.fromEntries(convertToParams(bookState)),
      ...(painting && { painting: painting }),
      ...(page && { page: page }),
      ...(searchString && { searchString: searchString }),
    };

    setSearchParams(stringifiedParams);
  }, [
    cellHex,
    bookState,
    searchString,
    page,
    debug,
    painting,
    setSearchParams,
  ]);

  useEffect(() => {
    const x = searchParams.get("x");
    const y = searchParams.get("y");
    const z = searchParams.get("z");
    const cabinet = searchParams.get("cabinet");
    const unit = searchParams.get("unit");
    const row = searchParams.get("row");
    const book = searchParams.get("book");
    const page = searchParams.get("page");
    const searchString = searchParams.get("searchString");
    const painting = searchParams.get("painting") as Orientation;

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
    if (painting && ["N", "S", "E", "W"].includes(painting)) {
      setPainting(painting);
    }
    if (searchString) {
      setSearchstring(searchString);
    }
    if (page) {
      setBookOpen(true);
      setScreenLocked(true);
      setPage(parseInt(page));
    }
  }, [setCellHex, setBookState, setSearchstring, setDebug]);
};
