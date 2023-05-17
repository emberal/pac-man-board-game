import React from "react";
import {Counter} from "./pages/Counter";
import Home from "./pages/home";

const AppRoutes = [
  {
    index: true,
    element: <Home/>
  },
  {
    path: "/counter",
    element: <Counter/>
  },
];

export default AppRoutes;
