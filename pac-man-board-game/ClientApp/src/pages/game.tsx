import React, {FC, useEffect} from "react";
import {GameComponent} from "../components/gameComponent";
import {useAtomValue} from "jotai";
import {thisPlayerAtom} from "../utils/state";
import {customMap} from "../game/map";

const Game: FC = () => { // TODO gameId in path
  const player = useAtomValue(thisPlayerAtom);

  useEffect(() => {
    console.debug(player);
    if (!player) {
      // TODO player is undefined on first render, then defined on second render
      // window.location.href = "/";
    }
  }, [player]);

  if (player) {
    return <GameComponent player={player} map={customMap}/>;
  } else {
    return null;
  }
};

export default Game;
