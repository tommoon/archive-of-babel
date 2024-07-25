import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Game } from "./Screen/Game/Game.tsx";
import { Home } from "./Screen/Home/Home.tsx";
import { HomeLayout } from "./layouts/HomeLayout";
import { GameLayout } from "./layouts/GameLayout.tsx";
import ErrorPage from "./Screen/ErrorPage.tsx";
import { TextPage } from "./Screen/Home/TextPage.tsx";
import { ABOUT, CREDITS, PRIVACYPOLICY, TERMSOFUSE } from "./lib/texts.ts";
import Contact from "./Screen/Home/Contact.tsx";
import { Search } from "./Screen/Home/Search.tsx";
import { Contents } from "./Screen/Home/Contents.tsx";
import * as tutorials from './lib/tutorials';

// Dynamically create routes for tutorials
const tutorialRoutes = [
  {
    index:true,
    element: < Contents contents={tutorials} title={'Tutorials'} />
  },
  ...Object.entries(tutorials).map(([key, value]) => ({
  path: key,
  element: <TextPage markdownContent={value} />,
}))];

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
      {
        path: "termsofuse",
        element: <TextPage markdownContent={TERMSOFUSE} />
      },
      {
        path: "privacy",
        element: <TextPage markdownContent={PRIVACYPOLICY}/>
      },
      {
        path: "credits",
        element: <TextPage markdownContent={CREDITS}/>
      },
      {
        path: "about",
        element: <TextPage markdownContent={ABOUT}/>
      },
      {
        path: "contact",
        element: <Contact/>
      },
      {
        path: "search",
        element: <Search/>
      },
      {
        path: "tutorials",
        children: tutorialRoutes,
      }
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
