import React from "react";
import { Orientation, CellHex } from "@/types/CommonTypes";
import { LibraryMainRoom } from "../../../../../props/LibraryMainRoom";
import { LibraryCorridor } from "../../../../../props/LibraryCorridor";
import { Cabinets } from "../../../../../props/Cabinets";

export const SubCell: React.FC<{
  cellHex: CellHex;
  omit?: Orientation[] | null;
  hasColliders?: boolean;
}> = ({ cellHex, omit = null, hasColliders = true }) => {
  const orientations: Orientation[] = ["N", "S", "E", "W"];
  return (
    <>
      <LibraryMainRoom
        hasColliders={hasColliders}
        cellHex={cellHex}
      />
      {orientations.map((orientation) =>
        !omit?.includes(orientation) ? (
          <LibraryCorridor
            key={orientation}
            hasColliders={hasColliders}
            cellHex={cellHex}
            orientation={orientation}
          />
        ) : null,
      )}
      <Cabinets cellHex={cellHex} />
    </>
  );
};
