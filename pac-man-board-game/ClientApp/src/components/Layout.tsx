import React from "react";
import {NavMenu} from "./NavMenu";

export const Layout = ({children}: { children: React.ReactNode }) => (
    <div>
        <NavMenu/>
        <main>
            {children}
        </main>
    </div>
);
