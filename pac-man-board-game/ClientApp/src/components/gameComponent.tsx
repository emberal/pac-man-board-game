import React, {useEffect, useState} from "react";
import {AllDice} from "./dice";
import {GameAction} from "../websockets/actions";
import GameBoard from "./gameBoard";
import {Character, Ghost, PacMan} from "../game/character";
import WebSocketService from "../websockets/WebSocketService";
import {testMap} from "../game/map";
import {TileType} from "../game/tileType";
import Player, {State} from "../game/player";
import {Colour} from "../game/colour";
import PlayerStats from "../game/playerStats";

const wsService = new WebSocketService(import.meta.env.VITE_API);

const ghosts = [
  new Ghost({Colour: Colour.Purple}),
  new Ghost({Colour: Colour.Purple}),
];

export const GameComponent: Component<{ player: Player }> = ({player}) => {
  // TODO find spawn points
  const [characters, setCharacters] = useState<Character[]>();
  const [players, setPlayers] = useState<Player[]>([player]);

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

  function doAction(message: MessageEvent<string>): void { // TODO move to Service
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
        const playerProps = parsed.Data as PlayerProps[];
        console.log(playerProps);
        setPlayers(playerProps.map(p => new Player(p)));
        const pacMen = playerProps.filter(p => p.PacMan).map(p => new PacMan(p.PacMan!));
        console.log(pacMen);
        // TODO find spawn points
        setCharacters([...pacMen, ...ghosts]);
        break;
      case GameAction.ready:
        const isReady = parsed.Data.AllReady as boolean;
        if (isReady) {
          setCurrentPlayer(new Player(parsed.Data.Starter as PlayerProps));
        }
        setPlayers((parsed.Data.Players as PlayerProps[]).map(p => new Player(p)));
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
    <>
      <div className={"flex-center"}>
        {
          currentPlayer === undefined || currentPlayer.State === State.waitingForPlayers ?
            <button onClick={sendReady}>Ready</button> :
            <button onClick={startGameLoop}>Roll dice</button>
        }
      </div>
      <AllDice values={dice} onclick={handleDiceClick} selectedDiceIndex={selectedDice?.index}/>
      {players?.map(p => <PlayerStats key={p.Name} player={p} isCurrentPlayer={currentPlayer === p}/>)}
      {characters &&
        <GameBoard className={"mx-auto my-2"}
                   characters={characters}
                   selectedDice={selectedDice}
                   onMove={onCharacterMove} map={testMap}/>
      }
    </>
  );
};
