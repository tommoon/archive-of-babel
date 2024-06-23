import { gameController } from "@/Controllers/gameController";
import { Cell } from "./components/Cell/Cell";
import { useMemo } from "react";
import { LibraryStairs } from "./components/Cell/Stairs/LibraryStairs";

export const Cells = () => {
  const { playerPosition } = gameController();

  return useMemo(
    () => [
      <Cell
        centralCell
        key={`${playerPosition.x}-${playerPosition.y}-${playerPosition.z}`}
        position={playerPosition}
      />,
      <Cell
        key={`${playerPosition.x}-${playerPosition.y}-${playerPosition.z - 1}`}
        position={{ ...playerPosition, z: playerPosition.z - 1 }}
      />,
      <Cell
        key={`${playerPosition.x}-${playerPosition.y}-${playerPosition.z + 1}`}
        position={{ ...playerPosition, z: playerPosition.z + 1 }}
      />,
      <Cell
        noExtras
        key={`${playerPosition.x}-${playerPosition.y + 2}-${playerPosition.z}`}
        position={{ ...playerPosition, y: playerPosition.y + 2 }}
      />,
      <Cell
        noExtras
        key={`${playerPosition.x}-${playerPosition.y + 3}-${playerPosition.z}`}
        position={{ ...playerPosition, y: playerPosition.y + 3 }}
      />,
      <Cell
        key={`${playerPosition.x + 1}-${playerPosition.y}-${playerPosition.z}`}
        position={{ ...playerPosition, x: playerPosition.x + 1 }}
      />,
      <Cell
        key={`${playerPosition.x - 1}-${playerPosition.y}-${playerPosition.z}`}
        position={{ ...playerPosition, x: playerPosition.x - 1 }}
      />,
      <Cell
        noExtras
        key={`${playerPosition.x - 2}-${playerPosition.y}-${playerPosition.z}`}
        position={{ ...playerPosition, x: playerPosition.x - 2 }}
      />,
      <LibraryStairs key={"stairs"} position={playerPosition} />,
    ],
    [playerPosition],
  );
};
