import React, {useEffect} from "react";
import {GameComponent} from "../components/gameComponent";
import {useAtom} from "jotai";
import {thisPlayerAtom} from "../utils/state";

const Game: Component = () => {
  const [player] = useAtom(thisPlayerAtom); // TODO get player from session storage

  useEffect(() => {
    if (!player) {
      // TODO state dissapears on refresh
      window.location.href = "/";
    }
  }, []);

  if (player) {
    return <GameComponent player={player}/>;
  } else {
    return null;
  }
};

export default Game;
