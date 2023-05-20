import React, {useState} from "react";
import Game from "../game/game";
import {AllDice} from "./dice";
import {Action} from "../websockets/actions";
import GameBoard from "./gameBoard";
import {Ghost, PacMan} from "../game/character";

let game: Game;

const characters = [new PacMan("yellow"), new Ghost("purple")];

export const GameComponent: Component = () => {

  const [dice, setDice] = useState<number[]>();
  const [selectedDice, setSelectedDice] = useState<SelectedDice>();

  function handleDiceClick(selected: SelectedDice): void {
    setSelectedDice(selected);
    game.selectedDice = selected;
  }

  function startGameLoop(): void {
    if (!game.isConnected()) {
      setTimeout(startGameLoop, 50);
      return;
    }
    void game.gameLoop(setDice);
  }

  function updateState(): void {
    game.wsService.onReceive = (message) => {
      const parsed: ActionMessage = JSON.parse(message.data);

      switch (parsed.Action) {
        case Action.rollDice:
          setDice(parsed.Data as number[]); // Updates the state of other players
          break;
      }
    };
  }

  React.useEffect(() => {
    game = new Game();
    updateState();

    game.connectToServer();
    startGameLoop();
    return () => game.disconnect();
  }, []);

  return (
    <div>
      <h1 className={"w-fit mx-auto"}>Pac-Man The Board Game</h1>
      <div className={"flex justify-center"}>
        <button onClick={startGameLoop}>Roll dice</button>
      </div>
      <AllDice values={dice} onclick={handleDiceClick} selectedDiceIndex={selectedDice?.index}/>
      <GameBoard className={"mx-auto"} characters={characters}/>
    </div>
  );
};
