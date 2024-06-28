import { gameController } from "@/Controllers/gameController";
import { _objectIsEqual } from "@/lib/comparisons";
import { SubCell } from "./components/SubCell";
import { LibraryStairs } from "./components/LibraryStairs";
import { Books } from "./props/Books";

export const Cell = () => {
  const { playerPosition, debug } = gameController();

  return (
    playerPosition && (
      <group>
        <SubCell
          key={`${playerPosition.x}-${playerPosition.y}-${playerPosition.z}`}
          cellLocation={playerPosition}
        />

        <LibraryStairs cellLocation={playerPosition} orientation="N" />
        <LibraryStairs cellLocation={playerPosition} orientation="S" />
        <LibraryStairs cellLocation={playerPosition} orientation="W" />
        <LibraryStairs cellLocation={playerPosition} orientation="E" />

        <SubCell
          key={`${playerPosition.x}-${playerPosition.y}-${playerPosition.z + 1}` }
          cellLocation={{ ...playerPosition, z: playerPosition.z + 1 }}
          omit={["E", "S", "W"]}
        />
        <SubCell
          key={`${playerPosition.x}-${playerPosition.y}-${playerPosition.z - 1}` }
          cellLocation={{ ...playerPosition, z: playerPosition.z - 1 }}
          omit={["E", "N", "W"]}
        />
        <SubCell
          key={`${playerPosition.x + 1}-${playerPosition.y}-${playerPosition.z}` }
          cellLocation={{ ...playerPosition, x: playerPosition.x + 1 }}
          omit={["N", "E", "S"]}
        />
        <SubCell
          key={`${playerPosition.x - 1}-${playerPosition.y}-${playerPosition.z}` }
          cellLocation={{ ...playerPosition, x: playerPosition.x - 1 }}
          omit={["N", "W", "S"]}
        />

        <Books cellLocation={playerPosition} shelfIndex={0} />
        {/* Above*/}
        <SubCell
          omit={["W", "E", "S", "N"]}
          hasColliders={false}
          cellLocation={{ ...playerPosition, y: playerPosition.y + 1 }}
        />
        <SubCell
          omit={["W", "E", "S", "N"]}
          hasColliders={false}
          cellLocation={{ ...playerPosition, y: playerPosition.y + 2 }}
        />

        {/* Below */}
        <SubCell
          hasColliders={false}
          cellLocation={{ ...playerPosition, y: playerPosition.y - 1 }}
        />
      </group>
    )
  );
};
