import React from "react";
import { Orientation, CellHex } from "@/types/CommonTypes";
import { LibraryMainRoom } from "../../../../../props/LibraryMainRoom";
import { LibraryCorridor } from "../../../../../props/LibraryCorridor";
import { Cabinets } from "../../../../../props/Cabinets";
import { base32Add, base32Subtract } from "@/lib/base32Utils";

export const SubCell: React.FC<{
  cellHex: CellHex;
  omit?: Orientation[] | null;
}> = ({ cellHex, omit = null }) => {
  const orientations: Orientation[] = ["N", "S", "E", "W"];
  return (
    <>
      {!omit && <LibraryMainRoom
        hasColliders={false}
        cellHex={{ ...cellHex, y: base32Add(cellHex.y, '2') }}
      />}
            {!omit && <LibraryMainRoom
        hasColliders={false}
        cellHex={{ ...cellHex, y: base32Add(cellHex.y, '3') }}
      />}
      <LibraryMainRoom
        hasColliders={false}
        cellHex={{ ...cellHex, y: base32Add(cellHex.y, '1') }}
      />
      <LibraryMainRoom
        hasColliders={true}
        cellHex={cellHex}
      />
      <LibraryMainRoom
        hasColliders={false}
        cellHex={{ ...cellHex, y: base32Subtract(cellHex.y, '1') }}
      />
      {orientations.map((orientation) =>
        !omit?.includes(orientation) ? (
          <LibraryCorridor
            key={orientation}
            hasColliders={true}
            cellHex={cellHex}
            orientation={orientation}
          />
        ) : null,
      )}
      {!omit && orientations.map((orientation) =>
          <LibraryCorridor
            key={orientation}
            hasColliders={false}
            cellHex={{ ...cellHex, y: base32Subtract(cellHex.y, '1') }}
            orientation={orientation}
          />
      )}
      <Cabinets cellHex={{ ...cellHex, y: base32Add(cellHex.y, '1') }} />
      <Cabinets cellHex={cellHex} />
      <Cabinets cellHex={{ ...cellHex, y: base32Subtract(cellHex.y, '1') }} />
      </>
  );
};
