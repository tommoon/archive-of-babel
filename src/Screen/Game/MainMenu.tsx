import { Button } from "@/components/ui/button";
import { optionsController } from "@/Controllers/optionsController";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { useState, MouseEvent, TouchEvent } from "react";
import { Link } from "react-router-dom";

export const MainMenu = () => {
  const [mainMenu, setMainMenu] = useState(false);
  const { setDynamicLights, dynamicLights } = optionsController();
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
                Dynamic Lights{" "}
                <span className="text-muted text-xs">(can affect performance)</span>
              </span>
              <input
                checked={dynamicLights}
                type="checkbox"
                className="toggle toggle-accent"
                onChange={(e) => {
                  setDynamicLights(!dynamicLights);
                }}
                onClick={(e) => e.stopPropagation()}
              />
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
