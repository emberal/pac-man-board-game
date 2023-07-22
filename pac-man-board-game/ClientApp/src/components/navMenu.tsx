import React, {FC} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAtom, useAtomValue} from "jotai";
import {thisPlayerAtom} from "../utils/state";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import useToggle from "../hooks/useToggle";

const NavMenu: FC = () => {
  const player = useAtomValue(thisPlayerAtom);

  return (
    <header className={"z-10"}>
      <nav className="mb-3 flex justify-between border-b-2">
        <Link to="/"><h2 className={"m-1"}>Pac-Man Board Game</h2></Link>

        <ul className="inline-flex gap-2 items-center mr-5 relative">
          <NavItem to="/">Home</NavItem>
          <NavItem to={"/lobby"}>Lobby</NavItem>
          {
            player === undefined ?
              <NavItem className={"mx-2"} to={"/login"}>Login</NavItem>
              :
              /*TODO show user instead, when clicking a dropdown menu opens where the user can log out or other actions*/
              <ProfileDropdown className={"mx-2"}/>
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

const ProfileDropdown: FC<ComponentProps> = ({className}) => {
  const [player, setPlayer] = useAtom(thisPlayerAtom);
  const [isOpened, toggle] = useToggle(false);
  const navigate = useNavigate();

  async function logout(): Promise<void> {
    setPlayer(undefined);
    navigate("/login");
  }

  return (
    <>
      <li
        className={`inline-flex justify-center items-center cursor-pointer hover:bg-gray-100 h-full px-2 ${className}`}
        onClick={() => toggle()}>
        <UserCircleIcon className={"w-7"}/>
        <span>{player?.username}</span>
      </li>
      {
        isOpened &&
          <div className={"absolute right-2 border rounded-b -bottom-7 px-5"}>
              <button onClick={logout} className={"hover:underline"}>Logout</button>
          </div>
      }
    </>
  )
}
