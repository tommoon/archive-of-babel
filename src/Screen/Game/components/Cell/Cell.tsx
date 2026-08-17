import { gameController } from "@/Controllers/gameController";
import { SubCell } from "./components/SubCell";
import { LibraryStairs } from "../../../../props/LibraryStairs";
import { Books } from "../../../../props/Books";
import { base32Add, base32Subtract } from "@/lib/base32Utils";
import { PositionalAudio } from "@react-three/drei";
import ambience from '@/assets/sounds/ambience.mp3'
import { useRef } from "react";
import { PositionalAudio as PositionalAudioImpl } from 'three'
import { optionsController } from "@/Controllers/optionsController";
import { Painting } from "@/props/Painting";

export const Cell = () => {
  const { cellHex } = gameController();
  const { ambienceVol } = optionsController()
  const soundRef = useRef<PositionalAudioImpl>(null);

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

        <Painting cellHex={cellHex} orientation="N" />
        <Painting cellHex={cellHex} orientation="S" />
        <Painting cellHex={cellHex} orientation="W" />
        <Painting cellHex={cellHex} orientation="E" />
        
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
          <PositionalAudio
            url={ambience}
            ref={soundRef}
            loop
            distance={ambienceVol}
          autoplay
          /
        >
          <Books cellHex={cellHex} />
      </group>
    )
  );
};
