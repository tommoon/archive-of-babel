import { CellHex } from "@/types/CommonTypes";
import { create } from "zustand";

export type BookState = {
  cabinet: number | undefined;
  unit: number | undefined;
  row: number | undefined;
  book: number | undefined;
};

type gameState = {
  cellHex: CellHex;
  bookState: BookState;
  bookOpen: boolean;
  debug: boolean;
  screenLocked: boolean;
  setCellHex: (cellHex: CellHex) => void;
  setBookState: (bookState: BookState) => void;
  setBookOpen: (bookOpen: boolean) => void;
};

export const gameController = create<gameState>()((set, get) => ({
  cellHex: { x: "0", y: "0", z: "0" },
  bookState: {
    cabinet: undefined,
    unit: undefined,
    row: undefined,
    book: undefined,
  },
  bookOpen: false,
  debug: false,
  screenLocked: false,
  setCellHex: (cellHex: CellHex) => {
    const state = get();
    state.debug && console.log("setting cellHex to ", cellHex);
    set(() => ({
      cellHex: cellHex,
    }));
  },
  setBookState: (bookState: BookState) => {
    set(() => ({
      bookState: bookState,
    }));
  },
  setBookOpen: (bookOpen: boolean) => {
    set(() => ({
      bookOpen: bookOpen,
    }));
  },
}));

export const setScreenLocked = (screenLocked: boolean) => {
  gameController.setState({ screenLocked });
};

export const setDebug = () => {
  gameController.setState({ debug: true });
};
