import { CellHex, Orientation } from "@/types/CommonTypes";
import { create } from "zustand";

export type BookState = {
  cabinet: number | undefined;
  unit: number | undefined;
  row: number | undefined;
  book: number | undefined;
};

type gameState = {
  cellHex: CellHex;
  painting: Orientation | undefined;
  image: HTMLCanvasElement | null;
  bookState: BookState;
  bookOpen: boolean;
  debug: boolean;
  page: number;
  searchString: string | null;
  screenLocked: boolean;
  setImage: (image: HTMLCanvasElement | null) => void;
  setPainting: (painting: Orientation | undefined) => void;
  setCellHex: (cellHex: CellHex) => void;
  setBookState: (bookState: BookState) => void;
  setBookOpen: (bookOpen: boolean) => void;
  setPage: (page: number | undefined) => void;
  setSearchstring: (searchString: string | null) => void;
};

export const gameController = create<gameState>()((set, get) => ({
  cellHex: { x: "0", y: "0", z: "0" },
  painting: undefined,
  image: null,
  bookState: {
    cabinet: undefined,
    unit: undefined,
    row: undefined,
    book: undefined,
  },
  bookOpen: false,
  page: 0,
  searchString: null,
  debug: false,
  screenLocked: false,
  setCellHex: (cellHex: CellHex) => {
    const state = get();
    state.debug && console.log("setting cellHex to ", cellHex);
    set(() => ({
      cellHex: cellHex,
    }));
  },
  setImage: (image: HTMLCanvasElement | null) => {
    set(() => ({
      image: image,
    }));
  },
  setPainting: (painting: Orientation | undefined) => {
    set(() => ({
      bookState: {
        cabinet: undefined,
        unit: undefined,
        row: undefined,
        book: undefined,
      },
      painting: painting,
    }));
  },
  setBookState: (bookState: BookState) => {
    set(() => ({
      painting: undefined,
      bookState: bookState,
    }));
  },
  setBookOpen: (bookOpen: boolean) => {
    set(() => ({
      bookOpen: bookOpen,
    }));
  },
  setPage: (page: number | undefined) => {
    set(() => ({
      page: page,
    }));
  },
  setSearchstring: (searchString: string | null) => {
    set(() => ({
      searchString: searchString,
    }));
  },
}));

export const setScreenLocked = (screenLocked: boolean) => {
  gameController.setState({ screenLocked });
};

export const setDebug = () => {
  gameController.setState({ debug: true });
};
