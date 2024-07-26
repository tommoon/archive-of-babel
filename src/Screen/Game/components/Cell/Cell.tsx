import { gameController } from "@/Controllers/gameController";
import { _objectIsEqual } from "@/lib/comparisons";
import { SubCell } from "./components/SubCell";
import { LibraryStairs } from "../../../../props/LibraryStairs";
import { Books } from "../../../../props/Books";
import { Suspense } from "react";
import { base32Add, base32Subtract } from "@/lib/base32Utils";

export const Cell = () => {
  const { cellHex } = gameController();

  return (
    cellHex && (
      <group>
        <SubCell
          key={`${cellHex.x}-${cellHex.y}-${cellHex.z}`}
          cellHex={cellHex}
        />

        <LibraryStairs cellHex={cellHex} orientation="N" />
        <LibraryStairs cellHex={cellHex} orientation="S" />
        <LibraryStairs cellHex={cellHex} orientation="W" />
        <LibraryStairs cellHex={cellHex} orientation="E" />

        <SubCell
          key={`${cellHex.x}-${cellHex.y}-${base32Add(cellHex.z, '1')}`}
          cellHex={{ ...cellHex, z: base32Add(cellHex.z, '1') }}
          omit={["E", "S", "W"]}
        />
        <SubCell
          key={`${cellHex.x}-${cellHex.y}-${base32Subtract(cellHex.z, '1')}`}
          cellHex={{ ...cellHex, z: base32Subtract(cellHex.z, '1') }}
          omit={["E", "N", "W"]}
        />
        <SubCell
          key={`${base32Add(cellHex.x, '1')}-${cellHex.y}-${cellHex.z}`}
          cellHex={{ ...cellHex, x: base32Add(cellHex.x, '1') }}
          omit={["N", "E", "S"]}
        />
        <SubCell
          key={`${base32Subtract(cellHex.x, '1')}-${cellHex.y}-${cellHex.z}`}
          cellHex={{ ...cellHex, x: base32Subtract(cellHex.x, '1')}}
          omit={["N", "W", "S"]}
        />

          <Books cellHex={cellHex} />
      </group>
    )
  );
};
