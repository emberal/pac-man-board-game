import React from "react";
import {Counter} from "./pages/counter";
import Home from "./pages/home";
import Game from "./pages/game";
import LobbyPage from "./pages/lobby";

const AppRoutes = [
  {
    index: true,
    element: <Home/>
  },
  {
    path: "/counter",
    element: <Counter/>
  },
  {
    path: "/game",
    element: <Game/>,
  },
  {
    path: "/lobby",
    element: <LobbyPage/>,
  }
];

export default AppRoutes;
