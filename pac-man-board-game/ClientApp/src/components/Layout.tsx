import React, {Component, JSX} from "react";
import {Container} from "reactstrap";
import {NavMenu} from "./NavMenu";

export const Layout = ({children}: { children: JSX.Element }) => (
    <div>
        <NavMenu/>
        <Container tag="main">
            {children}
        </Container>
    </div>
);
