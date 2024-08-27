import { checkTouchDevice } from "@/lib/detectTouchDevice";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/localStorage";
import { create } from "zustand";

const [isMobile, fov, mobilePanSensitivity, fxVol, ambienceVol] =
  loadFromLocalStorage([
    "isMobile",
    "fov",
    "mobilePanSensitivity",
    "fxVol",
    "ambienceVol",
  ]);

export type optionsState = {
  isMobile: boolean;
  fov: number;
  mobilePanSensitivity: number;
  fxVol: number;
  ambienceVol: number;
  setFov: (fov: number) => void;
  setFxVol: (fxVol: number) => void;
  setAmbienceVol: (ambienceVol: number) => void;
  setIsMobile: (isMobile: boolean) => void;
  setPanSensitivity: (mobilePanSensitivity: number) => void;
};

export const optionsController = create<optionsState>()((set) => ({
  isMobile: (isMobile && JSON.parse(isMobile)) || checkTouchDevice(),
  fov: (fov && JSON.parse(fov)) || 60,
  mobilePanSensitivity:
    (mobilePanSensitivity && JSON.parse(mobilePanSensitivity)) || 20,
  fxVol: (fxVol && JSON.parse(fxVol)) || 1.0,
  ambienceVol: (ambienceVol && JSON.parse(ambienceVol)) || 0.5,
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
  setFov: (fov: number) => {
    saveToLocalStorage("fov", fov);
    set(() => ({
      fov: fov,
    }));
  },
  setFxVol: (fxVol: number) => {
    saveToLocalStorage("fxVol", fxVol);
    set(() => ({
      fxVol: fxVol,
    }));
  },
  setAmbienceVol: (ambienceVol: number) => {
    saveToLocalStorage("ambienceVol", ambienceVol);
    set(() => ({
      ambienceVol: ambienceVol,
    }));
  },
}));
