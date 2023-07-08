import React, {useEffect} from "react";
import {GameComponent} from "../components/gameComponent";
import {useAtomValue} from "jotai";
import {thisPlayerAtom} from "../utils/state";

const Game: Component = () => {
  const player = useAtomValue(thisPlayerAtom);

  useEffect(() => {
    console.debug(player);
    if (!player) {
      // TODO player is undefined on first render, then defined on second render
      // window.location.href = "/";
    }
  }, [player]);

  if (player) {
    return <GameComponent player={player}/>;
  } else {
    return null;
  }
};

export default Game;
