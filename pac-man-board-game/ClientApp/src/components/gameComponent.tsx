import React from "react";
import GameCanvas from "../components/gameCanvas";
import Game from "../game/game";

export const GameComponent: Component = () => {

  React.useEffect(() => {
    const game = new Game();
    const id = setInterval(game.gameLoop, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h1 className={"w-fit mx-auto"}>Pac-Man</h1>
      <GameCanvas className={"mx-auto"}/>
    </div>
  );
};
