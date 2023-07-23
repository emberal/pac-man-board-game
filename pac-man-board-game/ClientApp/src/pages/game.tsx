import React, {FC} from "react";
import {GameComponent} from "../components/gameComponent";
import {useAtomValue} from "jotai";
import {selectedMapAtom, thisPlayerAtom} from "../utils/state";

const Game: FC = () => {
  const player = useAtomValue(thisPlayerAtom);
  const map = useAtomValue(selectedMapAtom);

  if (player && map) {
    return <GameComponent player={player} map={map}/>;
  } else {
    return null;
  }
};

export default Game;
