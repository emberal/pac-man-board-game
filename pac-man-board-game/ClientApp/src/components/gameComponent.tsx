import React, {useEffect, useState} from "react";
import {AllDice} from "./dice";
import {GameAction} from "../websockets/actions";
import GameBoard from "./gameBoard";
import {Character, Ghost, PacMan} from "../game/character";
import WebSocketService from "../websockets/WebSocketService";
import {testMap} from "../game/map";
import {TileType} from "../game/tileType";
import Player, {State} from "../game/player";

const wsService = new WebSocketService(import.meta.env.VITE_API);

const ghosts = [
  new Ghost({Colour: "purple"}),
  new Ghost({Colour: "purple"})
];

export const GameComponent: Component<{ player: Player }> = (
  {
    player
  }) => {
  // TODO find spawn points
  const [characters, setCharacters] = useState<Character[]>();

  const [dice, setDice] = useState<number[]>();
  const [selectedDice, setSelectedDice] = useState<SelectedDice>();
  const [currentPlayer, setCurrentPlayer] = useState<Player>();

  function handleDiceClick(selected: SelectedDice): void {
    setSelectedDice(selected);
  }

  function rollDice(): void {
    wsService.send({Action: GameAction.rollDice});
  }

  function startGameLoop(): void {
    if (currentPlayer !== player) return;

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
        updateCharacters(parsed);
        removeEatenPellets(parsed);
        break;
      case GameAction.playerInfo:
        const players = parsed.Data as PlayerProps[];
        console.log(players);
        const pacMen = players.filter(p => p.PacMan).map(p => new PacMan(p.PacMan!));
        console.log(pacMen);
        // TODO find spawn points
        setCharacters([...pacMen, ...ghosts]);
        break;
    }
  }

  function removeEatenPellets(parsed: ActionMessage): void {
    const pellets = parsed.Data?.eatenPellets as Position[];

    for (const pellet of pellets) {
      testMap[pellet.y][pellet.x] = TileType.empty;
    }
  }

  function updateCharacters(parsed: ActionMessage): void {
    const updatedCharacters = parsed.Data?.characters as CharacterProps[] | undefined;

    if (updatedCharacters) {
      const newList: Character[] = [];
      for (const character of updatedCharacters) {
        newList.push(new Character(character));
      }
      setCharacters(newList);
    }
  }

  function onCharacterMove(eatenPellets: Position[]): void {
    if (dice && selectedDice) {
      dice.splice(selectedDice.index, 1);
    }
    setSelectedDice(undefined);
    const data: ActionMessage = {
      Action: GameAction.moveCharacter,
      Data: {
        dice: dice?.length ?? 0 > 0 ? dice : null,
        characters: characters,
        eatenPellets: eatenPellets
      }
    };
    wsService.send(data);
  }

  async function sendPlayer(): Promise<void> {
    await wsService.waitForOpen();
    wsService.send({Action: GameAction.playerInfo, Data: player});
  }

  useEffect(() => {
    wsService.onReceive = doAction;
    wsService.open();

    void sendPlayer();
    // TODO send action to backend when all players are ready
    //  The backend should then send the first player as current player
    return () => wsService.close();
  }, []);

  function sendReady() {
    wsService.send({Action: GameAction.ready});
  }

  return (
    <div>
      <h1 className={"w-fit mx-auto"}>Pac-Man The Board Game</h1>
      <div className={"flex-center"}>
        {
          player.State === State.waitingForPlayers ?
            <button onClick={sendReady}>Ready</button> :
            <button onClick={startGameLoop}>Roll dice</button>
        }
      </div>
      <AllDice values={dice} onclick={handleDiceClick} selectedDiceIndex={selectedDice?.index}/>
      {
        (characters?.filter(c => c.isPacMan()) as PacMan[] | undefined)?.map(c =>
          <div key={c.Colour} className={"mx-auto w-fit m-2"}>
            <p className={currentPlayer === player ? "underline" : ""}>Player: {player.Colour}</p>
            <p>Pellets: {player.Box.count}</p>
            <p>PowerPellets: {player.Box.countPowerPellets}</p>
          </div>)
      }
      {characters &&
        <GameBoard className={"mx-auto my-2"}
                   characters={characters}
                   selectedDice={selectedDice}
                   onMove={onCharacterMove} map={testMap}/>
      }
    </div>
  );
};
