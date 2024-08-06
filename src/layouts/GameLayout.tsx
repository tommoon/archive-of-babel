import { Outlet } from "react-router-dom";
import { MainMenu } from "@/Screen/Game/MainMenu";
import { useAnalyticsTracker } from "@/useAnalyticsTracker";

export const GameLayout = () => {
  useAnalyticsTracker()

  return (
    <div className="w-screen h-screen">
      <MainMenu />
      <Outlet />
    </div>
  );
};
