import { gameController, setDebug } from "@/Controllers/gameController";
import { CellLocation } from "@/types/CommonTypes";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useQueryString = ({
  cellLocation,
}: {
  cellLocation?: CellLocation;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setPlayerPosition, debug } = gameController();

  useEffect(() => {
    if (!cellLocation) return;
    const stringifiedParams = Object.fromEntries(
      Object.entries(cellLocation).map(([key, value]) => [
        key,
        value.toString(),
      ])
    );
    debug && console.log("url params updated to ", stringifiedParams);
    setSearchParams(stringifiedParams);
  }, [cellLocation]);

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
      setPlayerPosition({
        x: parseInt(x, 10),
        y: parseInt(y, 10),
        z: parseInt(z, 10),
      });
    } else {
      setPlayerPosition({ x: 0, y: 0, z: 0 });
    }
  }, []);

  return updateQueryString;
};
