import React, {FC, useEffect} from "react";
import {GameComponent} from "../components/gameComponent";
import {useAtomValue} from "jotai";
import {selectedMapAtom, thisPlayerAtom} from "../utils/state";

const Game: FC = () => { // TODO gameId in path
  const player = useAtomValue(thisPlayerAtom);
  const map = useAtomValue(selectedMapAtom);

  useEffect(() => {
    console.debug(player);
    if (!player) {
      // TODO player is undefined on first render, then defined on second render
      // window.location.href = "/";
    }
  }, [player]);

  if (player && map) {
    return <GameComponent player={player} map={map}/>;
  } else {
    throw new Error("Player or map is undefined");
  }
};

export default Game;
