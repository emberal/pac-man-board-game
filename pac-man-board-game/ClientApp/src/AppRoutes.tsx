import React from "react";
import {Counter} from "./pages/counter";
import Game from "./pages/game";
import LobbyPage from "./pages/lobby";
import Login from "./pages/login";

const AppRoutes = [
  {
    index: true,
    element: <LobbyPage/> // TODO change to home page
  },
  {
    path: "/counter",
    element: <Counter/>
  },
  {
    path: "/game/:id",
    element: <Game/>,
    secured: true
  },
  {
    path: "/lobby",
    element: <LobbyPage/>,
    secured: true
  },
  {
    path: "/login",
    element: <Login/>
  }
];

export default AppRoutes;
