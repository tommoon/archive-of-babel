import { gameController } from "@/Controllers/gameController";
import { _objectIsEqual } from "@/lib/comparisons";
import { LibraryMainRoom } from "./components/LibraryMainRoom";
import { LibraryCorridor } from "./components/LibraryCorridor";
import { SubCell } from "./components/SubCell";
import { LibraryStairs } from "./components/LibraryStairs";
import { Books } from "./props/Books";

export const Cell = () => {
  const { playerPosition, debug } = gameController();
  /* 
  const adjustedPosition = useMemo(
    () => new Vector3(position.x * 11, position.y * 2, position.z * 11),
    [position],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (cellRef.current) {
        const bb = new Box3().setFromObject(cellRef.current);
        const inside = bb.containsPoint(playerPos);
        if (inside && !_objectIsEqual(position, playerPosition)) {
          console.log(position, playerPosition, inside);
          setPlayerPosition(position);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cellRef, playerPosition, position]);
 */
  return (
    <group>
      <LibraryMainRoom cellLocation={playerPosition} />
      <LibraryCorridor cellLocation={playerPosition} orientation="E" />
      <LibraryCorridor cellLocation={playerPosition} orientation="W" />
      <LibraryCorridor cellLocation={playerPosition} orientation="N" />
      <LibraryCorridor cellLocation={playerPosition} orientation="S" />

      <LibraryStairs cellLocation={playerPosition} orientation="N" />
      <LibraryStairs cellLocation={playerPosition} orientation="S"/>
      <LibraryStairs cellLocation={playerPosition} orientation="W"/>
      <LibraryStairs cellLocation={playerPosition} orientation="E" />
      
      <SubCell
        cellLocation={{ ...playerPosition, z: playerPosition.z + 1 }}
        omit={["E", "S", "W"]}
      />
      <SubCell
        cellLocation={{ ...playerPosition, z: playerPosition.z - 1 }}
        omit={["E", "N", "W"]}
      />
      <SubCell
        cellLocation={{ ...playerPosition, x: playerPosition.x + 1 }}
        omit={["N", "E", "S"]}
      />
      <SubCell
        cellLocation={{ ...playerPosition, x: playerPosition.x - 1 }}
        omit={["N", "W", "S"]}
      />

      <Books cellLocation={playerPosition} shelfIndex={0} />
      {/* Above*/}
      <SubCell omit={['W','E','S','N']} hasColliders={false} cellLocation={{ ...playerPosition, y: playerPosition.y + 1 }} />
      <SubCell omit={['W','E','S','N']} hasColliders={false} cellLocation={{ ...playerPosition, y: playerPosition.y + 2 }} />

      {/* Below */}
      <SubCell  hasColliders={false} cellLocation={{ ...playerPosition, y: playerPosition.y - 1 }} />

    </group>
  );
};
