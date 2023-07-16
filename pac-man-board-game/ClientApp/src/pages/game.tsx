import React, {useEffect} from "react";
import {GameComponent} from "../components/gameComponent";
import {useAtomValue} from "jotai";
import {thisPlayerAtom} from "../utils/state";
import {testMap} from "../game/map";

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
    return <GameComponent player={player} map={testMap}/>;
  } else {
    return null;
  }
};

export default Game;
