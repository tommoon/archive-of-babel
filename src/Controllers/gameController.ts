import { CellLocation } from "@/types/CommonTypes";
import { Vector3 } from "three";
import { create } from "zustand";

type gameState = {
  playerPosition: CellLocation | undefined;
  selectedSeed: string | null;
  debug: boolean;
  screenLocked: boolean;
  setPlayerPosition: (playerPosition: CellLocation) => void;
};

export const gameController = create<gameState>()((set, get) => ({
  playerPosition: undefined,
  selectedSeed: null,
  debug: false,
  screenLocked: false,
  setPlayerPosition: (playerPosition: CellLocation) => {
    console.log("setting player position to ", playerPosition);
    set(() => ({
      playerPosition: playerPosition,
    }));
  },
  setDisableLock: (lock: boolean) => {
    set(() => ({
      screenLocked: lock,
    }));
  },
}));

export const setSelectedSeed = (selectedSeed: string | null) => {
  gameController.setState({ selectedSeed });
};
export const setScreenLocked = (screenLocked: boolean) => {
  gameController.setState({ screenLocked });
};
