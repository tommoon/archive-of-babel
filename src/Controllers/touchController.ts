import { create } from "zustand";

type Touch = { dx: number; dy: number };
type TouchState = {
  move: Touch;
  pan: Touch;
  updateMovement: (type: "move" | "pan", state: Touch) => void;
};

export const touchController = create<TouchState>()((set) => ({
  move: { dx: 0, dy: 0 },
  pan: { dx: 0, dy: 0 },
  updateMovement: (type: "move" | "pan", state: Touch) => {
    set(() => ({
      [type]: state,
    }));
  },
}));
