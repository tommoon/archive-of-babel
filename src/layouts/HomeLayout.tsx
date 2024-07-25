import { Footer } from "@/Screen/Home/components/Footer";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Spin as Hamburger } from 'hamburger-react';
import { BookText, GraduationCap, TextSearch } from "lucide-react";
import { Background } from "@/Screen/Home/components/Background";

export const HomeLayout = () => {
  const [yPos, setYPos] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setYPos(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Background />
    <div className="relative text-base-content">
      <div
        className={cn(
          "navbar fixed top-0 left-0 right-0 z-30 transition-colors",
          yPos > 0 && "bg-base-200",
          isOpen && "bg-base-200",
          "justify-center"
        )}
      >
        <Link to={'/'} className=" sm:text-2xl font-bold mx-auto">Archive of Babel</Link>
        <div className="flex-none absolute right-0 mr-4">
            <Hamburger toggled={isOpen} toggle={setIsOpen} />
        </div>
        {isOpen && (
          <div className="menu absolute top-14 right-0 z-20 w-full sm:w-auto bg-base-200">
            <ul className="menu rounded-box w-full sm:w-72 bg-base-200 text-2xl space-y-4">
            <li>
              <Link to={'search'}>
                <TextSearch/>
                Advanced Search
              </Link>
            </li>
            <li>
              <a>
                <BookText/>
                Theory
              </a>
            </li>
            <li>
              <Link to={'tutorials'}>
                <GraduationCap/>
                Tutorials
              </Link>
            </li>
          </ul>
        </div>
          )}
      </div>
      
        <div className="min-h-screen">
          <Outlet />
        </div>
        {isOpen && <div onClick={() => setIsOpen(false)} className="absolute inset-0  backdrop-blur-md bg-black/10 z-10" />}

        <Footer />
      </div>
      </>
  );
};
