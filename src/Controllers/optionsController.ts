import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/localStorage";
import { create } from "zustand";

const dynamicLights = loadFromLocalStorage("dynamicLights");
const isMobile = loadFromLocalStorage("isMobile");

export type optionsState = {
  dynamicLights: boolean;
  isMobile: boolean;
  setDynamicLights: (dynamicLights: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
};

export const optionsController = create<optionsState>()((set) => ({
  dynamicLights: (dynamicLights && JSON.parse(dynamicLights)) || false,
  isMobile: (isMobile && JSON.parse(isMobile)) || false,
  setDynamicLights: (dynamicLights: boolean) => {
    saveToLocalStorage("dynamicLights", dynamicLights);
    set(() => ({
      dynamicLights: dynamicLights,
    }));
  },
  setIsMobile: (isMobile: boolean) => {
    saveToLocalStorage("isMobile", isMobile);
    set(() => ({
      isMobile: isMobile,
    }));
  },
}));
