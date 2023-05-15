import React from "react";
import {Route, Routes} from "react-router-dom";
import {Layout} from "./components/Layout";
import AppRoutes from "./AppRoutes";
import "./index.css";

export const App: Component = () => (
  <Layout>
    <Routes>
      {AppRoutes.map((route, index) => {
        const {element, ...rest} = route;
        return <Route key={index} {...rest} element={element}/>;
      })}
    </Routes>
  </Layout>
);
