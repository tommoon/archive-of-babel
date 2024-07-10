import { Footer } from "@/Screen/Home/components/Footer";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export const HomeLayout = () => {
  const [yPos, setYPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => setYPos(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative text-base-content">
      <div
        className={cn(
          "navbar fixed top-0 left-0 right-0 z-30 transition-colors",
          yPos > 0 && "bg-base-200",
          "justify-center",
        )}
      >
        <a className=" sm:text-2xl font-bold mx-auto">Archive of Babel</a>
        <div className="flex-none absolute right-0 mr-4">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};
