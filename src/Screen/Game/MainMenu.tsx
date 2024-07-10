import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { useState, MouseEvent, TouchEvent } from "react";
import { Link } from "react-router-dom";

export const MainMenu = () => {
  const [mainMenu, setMainMenu] = useState(false);
  const menuClick = (
    event: MouseEvent<SVGSVGElement> | TouchEvent<SVGSVGElement>,
  ) => {
    event.stopPropagation();
    setMainMenu(true);
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
          "modal modal-bottom sm:modal-middle ",
          mainMenu && "modal-open",
        )}
        onClick={(event) => {
          event.stopPropagation();
          setMainMenu(false);
        }}
      >
        <div className="modal-box backdrop-blur-md bg-black">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <Link className="btn btn-accent text-xl" type="button" to={"/"}>
              Back to Main Menu
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
};
