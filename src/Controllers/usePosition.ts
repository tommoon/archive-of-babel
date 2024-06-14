import { SceneProp, acceptedPropertyValues } from "@/types/EditorTypes";
import { Vector3 } from "three";
import { create } from "zustand";

type EditorState = {
  playerPositon: Vector3;
  setPlayerPosition: (playerPosition: Vector3) => void;
};

export const usePosition = create<EditorState>()((set, get) => ({
  playerPositon: new Vector3(0, 0, 0),
  setPlayerPosition: (playerPosition: Vector3) => {
    set(() => ({
      playerPositon: playerPosition,
    }));
  },
}));
