import React, {FC} from "react";
import {Link} from "react-router-dom";
import {useAtomValue} from "jotai";
import {thisPlayerAtom} from "../utils/state";

const HomePage: FC = () => {
  const player = useAtomValue(thisPlayerAtom);

  return (
    <div className={"container max-w-[800px] mx-auto px-2"}>
      <h1 className={"w-fit mx-auto"}>Hello {player?.username ?? "Player"}. Do you want to play a game?</h1>
      <p className={"text-center mt-5"}>
        {!player ?
          <>Start by {" "}
            <Link to={"/login"} className={"text-blue-600"}>logging in</Link>.
          </>
          :
          <>Go to the {" "}
            <Link to={"/lobby"} className={"text-blue-600"}>lobby</Link> to select a game.
          </>
        }
      </p>
    </div>
  );
};

export default HomePage;