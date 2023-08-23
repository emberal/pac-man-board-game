import React, {FC, useEffect} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import Layout from "./components/layout";
import AppRoutes from "./AppRoutes";
import "./index.css";
import {useAtomValue} from "jotai";
import {thisPlayerAtom} from "./utils/state";

export const App: FC = () => (
  <Layout>
    <Routes>
      {AppRoutes.map((route, index) => {
        const {element, secured = false, ...rest} = route;
        return <Route key={index} {...rest} element={<Secured secured={secured}>{element}</Secured>}/>;
      })}
    </Routes>
  </Layout>
);

/**
 * This component is used to redirect the user to the login page if they are not logged in and the page is secured.
 * @param children The children to render if the user is logged in or the page is not secured.
 * @param secured Whether or not the page is secured.
 * @constructor The Secured component.
 */
const Secured: FC<{ secured: boolean } & ChildProps> = ({children, secured}) => {
  const player = useAtomValue(thisPlayerAtom);
  const navigate = useNavigate();
  const redirect = secured && player === undefined

  useEffect(() => {
    if (redirect) {
      navigate("/login");
    }
  }, []);

  if (!redirect) {
    return (
      <>{children}</>
    )
  }
}
