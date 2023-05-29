import React, {useEffect, useState} from "react";
import {AllDice} from "./dice";
import {GameAction} from "../websockets/actions";
import GameBoard from "./gameBoard";
import {Character, Ghost, PacMan} from "../game/character";
import WebSocketService from "../websockets/WebSocketService";
import {testMap} from "../game/map";
import {Direction} from "../game/direction";
import Box from "../game/box";

const wsService = new WebSocketService("wss://localhost:3000/api/game");

export const GameComponent: Component = () => {
  // TODO find spawn points
  const [characters, setCharacters] = useState([
    new PacMan("yellow", {at: {x: 3, y: 3}, direction: Direction.up}),
    new Ghost("purple", {at: {x: 8, y: 3}, direction: Direction.up})
  ]);

  const [dice, setDice] = useState<number[]>();
  const [selectedDice, setSelectedDice] = useState<SelectedDice>();

  function handleDiceClick(selected: SelectedDice): void {
    setSelectedDice(selected);
  }

  function rollDice(): void {
    wsService.send({Action: GameAction.rollDice});
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
      case GameAction.rollDice:
        setDice(parsed.Data as number[]);
        break;
      case GameAction.moveCharacter:
        setDice(parsed.Data?.dice as number[]);
        const character = parsed.Data?.character satisfies Ghost | PacMan;
        const currentCharacter = characters.find(c => c.color === character.color);

        if (currentCharacter) {
          currentCharacter.position = character.position;
        }

        // TODO update pellets on other clients (character and on map)
        // if (character satisfies PacMan) {
        //   (characters[currentCharacter] as PacMan).box = new Box(character.box.colour, character.box.pellets);
        //   console.log(characters[currentCharacter]);
        // }
        break;
    }
  }

  function onCharacterMove(character: Character): void {
    if (dice && selectedDice) {
      dice.splice(selectedDice.index, 1);
    }
    setSelectedDice(undefined);
    const data: ActionMessage = {
      Action: GameAction.moveCharacter,
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
      <div className={"flex-center"}>
        <button onClick={startGameLoop}>Roll dice</button>
      </div>
      <AllDice values={dice} onclick={handleDiceClick} selectedDiceIndex={selectedDice?.index}/>
      {
        (characters.filter(c => c instanceof PacMan) as PacMan[]).map(c =>
          <div key={c.color} className={"mx-auto w-fit m-2"}>
            <p>Pac-Man: {c.color}</p>
            <p>Pellets: {c.box.count}</p>
            <p>PowerPellets: {c.box.countPowerPellets}</p>
          </div>)
      }
      <GameBoard className={"mx-auto my-2"} characters={characters} selectedDice={selectedDice}
                 onMove={onCharacterMove} map={testMap}/>
    </div>
  );
};
