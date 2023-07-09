import React, {useEffect} from "react";
import {AllDice} from "./dice";
import {doAction, GameAction} from "../utils/actions";
import GameBoard from "./gameBoard";
import WebSocketService from "../websockets/WebSocketService";
import {testMap} from "../game/map";
import Player, {State} from "../game/player";
import PlayerStats from "../components/playerStats";
import {useAtom} from "jotai";
import {charactersAtom, currentPlayerAtom, diceAtom, playersAtom, selectedDiceAtom} from "../utils/state";

const wsService = new WebSocketService(import.meta.env.VITE_API);

export const GameComponent: Component<{ player: Player }> = ({player}) => {
  // TODO find spawn points
  const [characters] = useAtom(charactersAtom);
  const [players] = useAtom(playersAtom);

  const [dice] = useAtom(diceAtom);
  const [selectedDice, setSelectedDice] = useAtom(selectedDiceAtom);
  const [currentPlayer] = useAtom(currentPlayerAtom);

  function startGameLoop(): void {
    if (currentPlayer?.Name !== player.Name) return;

    setSelectedDice(undefined);
    wsService.send({Action: GameAction.rollDice});
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
    wsService.send({Action: GameAction.playerInfo, Data: player});
  }

  useEffect(() => {
    wsService.onReceive = doAction;
    wsService.open();

    wsService.waitForOpen().then(() => void sendPlayer());

    return () => wsService.close();
  }, []);

  function sendReady(): void {
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
      <AllDice values={dice} selectedDiceIndex={selectedDice?.index}/>
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
