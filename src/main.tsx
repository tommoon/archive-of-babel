// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Game } from "./Screen/Game/Game.tsx";
import { Home } from "./Screen/Home/Home.tsx";
import { HomeLayout } from "./layouts/HomeLayout";
import { GameLayout } from "./layouts/GameLayout.tsx";
import ErrorPage from "./Screen/ErrorPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/",
    element: <GameLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "game",
        element: <Game />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
