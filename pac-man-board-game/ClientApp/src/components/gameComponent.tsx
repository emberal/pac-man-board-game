import React, {useEffect, useRef, useState} from "react";
import Game from "../game/game";
import {AllDice} from "./dice";
import {Action} from "../websockets/actions";
import GameBoard from "./gameBoard";
import {Character, Ghost, PacMan} from "../game/character";

let game: Game;

export const GameComponent: Component = () => {
  // Better for testing than outside of the component
  const characters = useRef([new PacMan("yellow"), new Ghost("purple")]);

  const [dice, setDice] = useState<number[]>();
  const [selectedDice, setSelectedDice] = useState<SelectedDice>();

  function handleDiceClick(selected: SelectedDice): void {
    setSelectedDice(selected);
    game.selectedDice = selected;
  }

  function startGameLoop(): void {
    setSelectedDice(undefined);
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
        case Action.moveCharacter:
          setDice(parsed.Data?.dice as number[]);
          const character = parsed.Data?.character as Character;
          characters.current.find(c => c.color === character.color)?.moveTo(character.position);
          break;
      }
    };
  }

  function onCharacterMove(character: Character): void {
    if (dice && selectedDice) {
      // Remove the dice that was used from the list of dice

      dice.splice(selectedDice.index, 1);
      setDice([...dice]);
    }
    setSelectedDice(undefined);
    const data: ActionMessage = {
      Action: Action.moveCharacter,
      Data: {
        dice: dice?.length ?? 0 > 0 ? dice : null,
        character: character
      }
    };
    game.wsService.send(data);
  }

  useEffect(() => {
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
      <GameBoard className={"mx-auto my-2"} characters={characters.current} selectedDice={selectedDice}
                 onMove={onCharacterMove}/>
    </div>
  );
};
