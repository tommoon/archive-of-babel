import { optionsController } from "@/Controllers/optionsController";
import { cn } from "@/lib/utils";
import { Settings, Volume2, VolumeX } from "lucide-react";
import { useState, MouseEvent, TouchEvent } from "react";
import { Link } from "react-router-dom";

export const MainMenu = () => {
  const [mainMenu, setMainMenu] = useState(false);
  const { setIsMobile, isMobile, mobilePanSensitivity, fov, fxVol, ambienceVol, setFxVol, setAmbienceVol, setPanSensitivity, setFov } = optionsController();
  const menuClick = (
    event: MouseEvent<SVGSVGElement> | TouchEvent<SVGSVGElement>,
  ) => {
    event.stopPropagation();
    setMainMenu(true);
  };

  const closeMenu = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    setMainMenu(false);
  };
  return (
    <>
      <div className="fixed right-[10%] top-[5%] z-10">
        {!mainMenu && (
          <Settings
            color="rgba(77, 64, 64, 0.70)"
            fill="rgba(77, 112, 112, 0.70)"
            className="w-12 h-12 md:w-24 md:h-24"
            onClick={menuClick}
            onTouchStart={menuClick}
          />
        )}
      </div>
      <dialog
        className={cn(
          "modal modal-bottom sm:modal-middle",
          mainMenu && "modal-open",
        )}
        onClick={closeMenu}
      >
        <div
          className="modal-box backdrop-blur-md bg-black text-white"
          onClick={(event) => event.stopPropagation()}
        >
          <button onClick={closeMenu} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          <div className="modal-action flex flex-col gap-4">
            <label className="label cursor-pointer">
              <span className="label-text">
                Mobile Controls
              </span>
              <input
                checked={isMobile}
                type="checkbox"
                className="toggle toggle-accent"
                onChange={() => {
                  setIsMobile(!isMobile);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
            {isMobile && <label className="label cursor-pointer">
              <span className="label-text">
                Pan Sensitivity
              </span>
              <input
                type="range"
                min={5}
                max={50}
                value={mobilePanSensitivity}
                onChange={(e) => setPanSensitivity(parseInt(e.target.value))}
                className="range range-accent range-sm max-w-[50%]" />
            </label>}
            {<label className="label cursor-pointer">
              <span className="label-text">
                Field of View
              </span>
              <input
                type="range"
                min={20}
                max={120}
                value={fov}
                onChange={(e) => setFov(parseInt(e.target.value))}
                className="range range-accent range-sm max-w-[50%]" />
            </label>}
            <div className="divider" />
            <label className="label cursor-pointer">
              <span className="label-text">
                FX Volume
              </span>
              <div
                className="flex gap-x-2 items-center"
                style={{
                  width: 'calc(50% + 2.5rem)',
                  maxWidth: 'calc(50% + 2.5rem)'
                }}
              >
              <button disabled={fxVol === 0} onClick={() => setFxVol(0)} className="btn btn-accent btn-circle btn-sm">
                {
                fxVol === 0 ? <VolumeX/> : <Volume2 />
                }
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={fxVol}
                onChange={(e) => setFxVol(parseFloat(e.target.value))}
                  className="range range-accent range-sm" />
                </div>
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">
                Ambient Sounds
              </span>
              <div
                className="flex gap-x-2 items-center"
                style={{
                  width: 'calc(50% + 2.5rem)',
                  maxWidth: 'calc(50% + 2.5rem)'
                }}
              >
              <button disabled={ambienceVol === 0} onClick={() => setAmbienceVol(0)} className="btn btn-accent btn-circle btn-sm">
                {
                ambienceVol === 0 ? <VolumeX/> : <Volume2 />
                }
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={ambienceVol}
                onChange={(e) => setAmbienceVol(parseFloat(e.target.value))}
                  className="range range-accent range-sm" />
                </div>
            </label>
            <div className="flex justify-between">
              <button onClick={closeMenu} className="btn btn-accent">close</button>
              <Link className="btn btn-neutral" type="button" to={"/"}>
                Back to Main Menu
              </Link>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
