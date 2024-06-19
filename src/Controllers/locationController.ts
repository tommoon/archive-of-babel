import { cellLocation } from "@/types/CommonTypes";
import { Vector3 } from "three";
import { create } from "zustand";

type locationState = {
  playerPosition: cellLocation;
  debug: boolean;
  setPlayerPosition: (playerPosition: cellLocation) => void;
};

export const locationController = create<locationState>()((set, get) => ({
  playerPosition: new Vector3(0, 0, 0),
  debug: true,
  setPlayerPosition: (playerPosition: cellLocation) => {
    console.log("player position updated", playerPosition);
    set(() => ({
      playerPosition: playerPosition,
    }));
  },
}));

/* locationController.subscribe((state) => {
  console.log(state.corridorLococation, state.playerPositon);
}); */
