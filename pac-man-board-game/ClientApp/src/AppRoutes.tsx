import React from "react";
import {Counter} from "./pages/counter";
import GamePage from "./pages/game";
import LobbyPage from "./pages/lobby";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";

const AppRoutes = [
  {
    index: true,
    element: <HomePage/>
  },
  {
    path: "/counter",
    element: <Counter/>
  },
  {
    path: "/game/:id",
    element: <GamePage/>,
    secured: true
  },
  {
    path: "/lobby",
    element: <LobbyPage/>,
    secured: true
  },
  {
    path: "/login",
    element: <LoginPage/>
  }
];

export default AppRoutes;
