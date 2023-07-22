import React, {FC} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAtom} from "jotai";
import {thisPlayerAtom} from "../utils/state";

const NavMenu: FC = () => {
  const [player, setPlayer] = useAtom(thisPlayerAtom);
  const navigate = useNavigate();

  async function logout(): Promise<void> {
    setPlayer(undefined);
    navigate("/login");
  }

  return (
    <header>
      <nav className="mb-3 flex justify-between border-b-2">
        <Link to="/"><h2 className={"m-1"}>Pac-Man Board Game</h2></Link>

        <ul className="inline-flex gap-2 items-center mr-5">
          <NavItem to="/">Home</NavItem>
          <NavItem to={"/lobby"}>Lobby</NavItem>
          {
            player === undefined ?
              <NavItem className={"mx-2"} to={"/login"}>Login</NavItem>
              :
              <li className={"mx-2"}>
                <button onClick={logout} className={"hover:underline"}>Logout</button>
              </li>
          }
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
