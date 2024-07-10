import { gameController, setDebug } from "@/Controllers/gameController";
import { CellHex } from "@/types/CommonTypes";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryString = ({ cellHex }: { cellHex?: CellHex }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setCellHex, debug } = gameController();

  useEffect(() => {
    if (!cellHex) return;
    const stringifiedParams = Object.fromEntries(
      Object.entries(cellHex).map(([key, value]) => [key, value.toString()])
    );
    debug && console.log("url params updated to ", stringifiedParams);
    setSearchParams(stringifiedParams);
  }, [cellHex]);

  const updateQueryString = () => {};

  useEffect(() => {
    const x = searchParams.get("x");
    const y = searchParams.get("y");
    const z = searchParams.get("z");
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
  }, []);

  return updateQueryString;
};
