import React, {FC} from "react";
import useToggle from "../hooks/useToggle";
import {BugAntIcon} from "@heroicons/react/20/solid";
import {selectedMapAtom} from "../utils/state";
import {useAtom} from "jotai";

const DebugMenu: FC = () => {

  const [open, toggleOpen] = useToggle();

  if (import.meta.env.DEV) {
    return (
      <div>
        {open && <DebugOptions/>}
        <button className={"fixed bottom-2 right-2 bg-gray-800 text-white p-2 z-50 rounded-full"}
                title={"Debug menu"}
                onClick={() => toggleOpen()}>
          <BugAntIcon className={"w-8 m-1"}/>
        </button>
      </div>

    );
  }
}

export default DebugMenu;

const DebugOptions: FC = () => {

  const [map, setMap] = useAtom(selectedMapAtom);

  function clearSessionStorage(): void {
    sessionStorage.clear();
  }

  function restartGame(): void {
    // TODO
  }

  return (
    <div className={"fixed w-max right-2 bottom-16 border-2 z-50 bg-white rounded-xl p-2"}>
      <button onClick={clearSessionStorage}>Clear sessionstorage</button>
      {/*<br/>*/}
      {/*<button onClick={restartGame}>Restart game</button>*/}
    </div>
  )
}
