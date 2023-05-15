import React, {JSX} from "react";
import {NavMenu} from "./NavMenu";

export const Layout = ({children}: { children: JSX.Element }) => (
    <div>
        <NavMenu/>
        <main>
            {children}
        </main>
    </div>
);
