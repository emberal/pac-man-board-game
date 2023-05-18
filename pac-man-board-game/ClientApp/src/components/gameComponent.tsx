import React from "react";
import GameCanvas from "../components/gameCanvas";
import Game from "../game/game";
import {AllDice} from "./dice";

export const GameComponent: Component = () => {

  const [dice, setDice] = React.useState<number[]>([0, 0]);

  React.useEffect(() => {
    let game: Game = new Game();
    game.connectToServer();
    function f() {
      if (!game.isConnected()) {
        setTimeout(f, 50);
        return;
      }
      game.gameLoop(setDice);
    }
    f();
    // TODO only call gameLoop after the previous one has finished
    // const id = setInterval(() => game.gameLoop(), 5000);
    // return () => clearInterval(id);
  }, []);
  
  React.useEffect(() => {
    console.log(dice);
  }, [dice]);

  return (
    <div>
      <h1 className={"w-fit mx-auto"}>Pac-Man</h1>
      <AllDice values={dice}/>
      <GameCanvas className={"mx-auto"}/>
    </div>
  );
};
