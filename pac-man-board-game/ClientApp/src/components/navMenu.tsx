import React, {FC, useEffect} from "react";
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
);

const ProfileDropdown: FC<ComponentProps> = ({className}) => {
  const [player, setPlayer] = useAtom(thisPlayerAtom);
  const [isOpened, toggleOpen] = useToggle();
  const navigate = useNavigate();

  async function logout(): Promise<void> {
    setPlayer(undefined);
    navigate("/login");
  }

  useEffect(() => {

    if (isOpened) {
      function closeIfOutsideButton(e: MouseEvent): void {
        if (isOpened && e.target instanceof HTMLElement) {
          if (e.target.closest("#profile-dropdown") === null) {
            toggleOpen(false);
          }
        }
      }

      document.addEventListener("click", closeIfOutsideButton);
      return () => document.removeEventListener("click", closeIfOutsideButton);
    }

  }, [isOpened]);

  return (
    <>
      <li id={"profile-dropdown"}
          className={`inline-flex-center cursor-pointer hover:bg-gray-100 h-full px-2 ${className}`}
          onClick={() => toggleOpen()}>
        <UserCircleIcon className={"w-7"}/>
        <span>{player?.username}</span>
      </li>
      {
        isOpened &&
          <div className={"absolute right-2 border rounded-b -bottom-9 px-5"}>
              <button onClick={logout} className={"hover:underline py-1"}>Logout</button>
          </div>
      }
    </>
  )
}
