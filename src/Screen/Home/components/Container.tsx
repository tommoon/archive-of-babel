import { ReactNode } from "react";

export const Container: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div
    className="
      w-full 
      mx-auto
      relative 
      z-10
      p-12
      backdrop-blur-md
      rounded-lg"
  >
    {children}
  </div>
);
