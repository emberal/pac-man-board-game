import React, {useEffect, useRef, useState} from "react";
import {AllDice} from "./dice";
import {Action} from "../websockets/actions";
import GameBoard from "./gameBoard";
import {Character, Ghost, PacMan} from "../game/character";
import WebSocketService from "../websockets/WebSocketService";
import {testMap} from "../game/map";

const wsService = new WebSocketService("wss://localhost:3000/api/game");

export const GameComponent: Component = () => {
  // Better for testing than outside of the component
  const characters = useRef([new PacMan("yellow"), new Ghost("purple")]);

  const [dice, setDice] = useState<number[]>();
  const [selectedDice, setSelectedDice] = useState<SelectedDice>();

  function handleDiceClick(selected: SelectedDice): void {
    setSelectedDice(selected);
  }

  function rollDice(): void {
    wsService.send({Action: Action.rollDice});
  }

  function startGameLoop(): void {
    setSelectedDice(undefined);
    if (!wsService.isOpen()) {
      setTimeout(startGameLoop, 50);
      return;
    }
    rollDice();
  }

  function doAction(message: MessageEvent<string>): void {
    const parsed: ActionMessage = JSON.parse(message.data);

    switch (parsed.Action) {
      case Action.rollDice:
        setDice(parsed.Data as number[]);
        break;
      case Action.moveCharacter:
        setDice(parsed.Data?.dice as number[]);
        const character = parsed.Data?.character as Character;
        characters.current.find(c => c.color === character.color)?.follow(character.position);
        break;
    }
  }

  function onCharacterMove(character: Character): void {
    if (dice && selectedDice) {
      dice.splice(selectedDice.index, 1);
    }
    setSelectedDice(undefined);
    const data: ActionMessage = {
      Action: Action.moveCharacter,
      Data: {
        dice: dice?.length ?? 0 > 0 ? dice : null,
        character: character
      }
    };
    wsService.send(data);
  }

  useEffect(() => {
    wsService.onReceive = doAction;
    wsService.open();

    startGameLoop();
    return () => wsService.close();
  }, []);

  return (
    <div>
      <h1 className={"w-fit mx-auto"}>Pac-Man The Board Game</h1>
      <div className={"flex justify-center"}>
        <button onClick={startGameLoop}>Roll dice</button>
      </div>
      <AllDice values={dice} onclick={handleDiceClick} selectedDiceIndex={selectedDice?.index}/>
      <GameBoard className={"mx-auto my-2"} characters={characters.current} selectedDice={selectedDice}
                 onMove={onCharacterMove} map={testMap}/>
    </div>
  );
};
