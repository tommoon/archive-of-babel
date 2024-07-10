import { Outlet } from "react-router-dom";
import { MainMenu } from "@/Screen/Game/MainMenu";

export const GameLayout = () => {
  return (
    <div className="w-screen h-screen">
      <MainMenu />
      <Outlet />
    </div>
  );
};
