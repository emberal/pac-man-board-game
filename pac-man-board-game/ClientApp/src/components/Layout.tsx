import React from "react";
import {NavMenu} from "./NavMenu";

export const Layout: Component<ChildProps> = ({children}) => (
  <div>
    <NavMenu/>
    <main>
      {children}
    </main>
  </div>
);
