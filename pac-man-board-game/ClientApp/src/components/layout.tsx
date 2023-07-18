import React from "react";
import NavMenu from "./navMenu";

const Layout: Component<ChildProps> = ({children}) => (
  <div>
    <NavMenu/>
    <main>
      {children}
    </main>
  </div>
);

export default Layout;
