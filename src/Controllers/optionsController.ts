import { checkTouchDevice } from "@/lib/detectTouchDevice";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/localStorage";
import { create } from "zustand";

const isMobile = loadFromLocalStorage("isMobile");
const mobilePanSensitivity = loadFromLocalStorage("mobilePanSensitivity");

export type optionsState = {
  isMobile: boolean;
  mobilePanSensitivity: number;
  setIsMobile: (isMobile: boolean) => void;
  setPanSensitivity: (mobilePanSensitivity: number) => void;
};

export const optionsController = create<optionsState>()((set) => ({
  isMobile: (isMobile && JSON.parse(isMobile)) || checkTouchDevice(),
  mobilePanSensitivity:
    (mobilePanSensitivity && JSON.parse(mobilePanSensitivity)) || 20,
  setIsMobile: (isMobile: boolean) => {
    saveToLocalStorage("isMobile", isMobile);
    set(() => ({
      isMobile: isMobile,
    }));
  },
  setPanSensitivity: (mobilePanSensitivity: number) => {
    saveToLocalStorage("mobilePanSensitivity", mobilePanSensitivity);
    set(() => ({
      mobilePanSensitivity: mobilePanSensitivity,
    }));
  },
}));
