import React, {FC} from "react";
import {Link} from "react-router-dom";

const NavMenu: FC = () => {
  return (
    <header>
      <nav className="mb-3 flex justify-between border-b-2">
        <Link to="/"><h2 className={"my-1"}>Pac-Man Board Game</h2></Link>

        <ul className="inline-flex gap-2 items-center mr-5">
          <NavItem to="/">Home</NavItem>
          <NavItem to={"/lobby"}>Lobby</NavItem>
          <NavItem className={"mx-2"} to={"/login"}>Login</NavItem>

          {/*TODO show signed in user when signed in, otherwise login button*/}
        </ul>
      </nav>
    </header>
  );
};

export default NavMenu;

const NavItem: FC<LinkProps> = ({to, children, className}) => (
  <li>
    <Link className={`hover:underline ${className}`} to={to}>{children}</Link>
  </li>
)
