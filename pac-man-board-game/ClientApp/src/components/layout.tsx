import React, { FC } from "react"
import NavMenu from "./navMenu"

const Layout: FC<ChildProps> = ({ children }) => (
  <div>
    <NavMenu />
    <main>{children}</main>
  </div>
)

export default Layout
