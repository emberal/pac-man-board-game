import React, {useEffect, useState} from "react";
import {AllDice} from "./dice";
import {GameAction} from "../websockets/actions";
import GameBoard from "./gameBoard";
import {Character, Ghost, PacMan} from "../game/character";
import WebSocketService from "../websockets/WebSocketService";
import {testMap} from "../game/map";
import {Direction} from "../game/direction";
import {TileType} from "../game/tileType";

const wsService = new WebSocketService("wss://localhost:3000/api/game");

export const GameComponent: Component = () => {
  // TODO find spawn points
  const [characters, setCharacters] = useState([
    new PacMan({
      colour: "yellow", spawnPosition: {at: {x: 3, y: 3}, direction: Direction.up}
    }),
    new Ghost({
      colour: "purple", spawnPosition: {at: {x: 8, y: 3}, direction: Direction.up}
    })
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
    if (!wsService.isOpen()) {
      setTimeout(startGameLoop, 50);
      return;
    }
    setSelectedDice(undefined);
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
        updateCharacter(parsed);
        removeEatenPellets(parsed);
        break;
    }
  }

  function removeEatenPellets(parsed: ActionMessage): void {
    const pellets = parsed.Data?.eatenPellets as Position[];

      for (const pellet of pellets){
        testMap[pellet.y][pellet.x] = TileType.empty;
      }
  }

  function updateCharacter(parsed: ActionMessage): void {
    const updatedCharacter = parsed.Data?.character satisfies Ghost | PacMan;
    const characterIndex = characters.findIndex(c => c.colour === updatedCharacter.colour);
    
    if (characters[characterIndex]) {
      if (updatedCharacter["box"] !== undefined) { // If Pac-Man
        (characters[characterIndex] as PacMan) = new PacMan(updatedCharacter);
      } else if (updatedCharacter satisfies CharacterProps) {
        (characters[characterIndex] as Ghost) = new Ghost(updatedCharacter);
      }
    }
  }

  function onCharacterMove(character: Character, eatenPellets: Position[]): void {
    if (dice && selectedDice) {
      dice.splice(selectedDice.index, 1);
    }
    setSelectedDice(undefined);
    const data: ActionMessage = {
      Action: GameAction.moveCharacter,
      Data: {
        dice: dice?.length ?? 0 > 0 ? dice : null,
        character: character,
        eatenPellets: eatenPellets
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
          <div key={c.colour} className={"mx-auto w-fit m-2"}>
            <p>Pac-Man: {c.colour}</p>
            <p>Pellets: {c.box.count}</p>
            <p>PowerPellets: {c.box.countPowerPellets}</p>
          </div>)
      }
      <GameBoard className={"mx-auto my-2"} characters={characters} selectedDice={selectedDice}
                 onMove={onCharacterMove} map={testMap}/>
    </div>
  );
};
