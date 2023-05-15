import React from "react";
import {Counter} from "./pages/Counter";
import {FetchData} from "./pages/FetchData";
import {Home} from "./pages/Home";

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
    path: "/fetch-data",
    element: <FetchData/>
  }
];

export default AppRoutes;
