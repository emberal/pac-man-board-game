import React from "react";
import {Counter} from "./pages/counter";
import Home from "./pages/home";
import Game from "./pages/game";

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
];

export default AppRoutes;
