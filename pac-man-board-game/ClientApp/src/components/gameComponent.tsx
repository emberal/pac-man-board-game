import React from "react";
import GameCanvas from "../components/gameCanvas";
import Game from "../game/game";
import {AllDice} from "./dice";

let game: Game;
export const GameComponent: Component = () => {

  const [dice, setDice] = React.useState<number[]>();

  function startGameLoop() {
    if (!game.isConnected()) {
      setTimeout(startGameLoop, 50);
      return;
    }
    void game.gameLoop(setDice);
  }

  function updateState() {
    game.wsService.onReceive = (message) => {
      const parsed = JSON.parse(message.data);
      if (parsed instanceof Array) {
        setDice(parsed);
      }
    };
  }

  React.useEffect(() => {
    game = new Game();
    updateState();

    game.connectToServer();
    startGameLoop();
  }, []);

  return (
    <div>
      <h1 className={"w-fit mx-auto"}>Pac-Man The Board Game</h1>
      <div className={"flex justify-center"}>
        <button onClick={startGameLoop}>Roll dice</button>
      </div>
      <AllDice values={dice}/>
      <GameCanvas className={"mx-auto"}/>
    </div>
  );
};
