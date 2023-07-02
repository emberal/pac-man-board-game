import React from "react";
import {GameComponent} from "../components/gameComponent";
import {useLocation} from "react-router-dom";
import Player from "../game/player";

const Game: Component = () => {
  const location = useLocation();
  const player = location.state as Player;

  return <GameComponent player={player}/>;
};

export default Game;
