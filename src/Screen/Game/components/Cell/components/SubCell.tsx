import React from "react";
import { Orientation, CellLocation } from "@/types/CommonTypes";
import { LibraryMainRoom } from "../../../../../props/LibraryMainRoom";
import { LibraryCorridor } from "../../../../../props/LibraryCorridor";
import { Cabinets } from "../../../../../props/Cabinets";

export const SubCell: React.FC<{
  cellLocation: CellLocation;
  omit?: Orientation[] | null;
  hasColliders?: boolean;
}> = ({ cellLocation, omit = null, hasColliders = true }) => {
  const orientations: Orientation[] = ["N", "S", "E", "W"];
  return (
    <>
      <LibraryMainRoom
        hasColliders={hasColliders}
        cellLocation={cellLocation}
      />
      {orientations.map((orientation) =>
        !omit?.includes(orientation) ? (
          <LibraryCorridor
            key={orientation}
            hasColliders={hasColliders}
            cellLocation={cellLocation}
            orientation={orientation}
          />
        ) : null,
      )}
      <Cabinets cellLocation={cellLocation} />
    </>
  );
};
