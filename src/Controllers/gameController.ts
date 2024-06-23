import { cellLocation } from "@/types/CommonTypes";
import { Vector3 } from "three";
import { create } from "zustand";

type gameState = {
  playerPosition: cellLocation;
  selectedSeed: string | null;
  debug: boolean;
  screenLocked: boolean;
  setPlayerPosition: (playerPosition: cellLocation) => void;
};

export const gameController = create<gameState>()((set, get) => ({
  playerPosition: new Vector3(0, 0, 0),
  selectedSeed: null,
  debug: false,
  screenLocked: false,
  setPlayerPosition: (playerPosition: cellLocation) => {
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
