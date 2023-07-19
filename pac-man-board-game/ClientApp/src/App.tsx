import React, {FC} from "react";
import {Route, Routes} from "react-router-dom";
import Layout from "./components/layout";
import AppRoutes from "./AppRoutes";
import "./index.css";

export const App: FC = () => (
  <Layout>
    <Routes>
      {AppRoutes.map((route, index) => {
        const {element, ...rest} = route;
        return <Route key={index} {...rest} element={element}/>;
      })}
    </Routes>
  </Layout>
);
