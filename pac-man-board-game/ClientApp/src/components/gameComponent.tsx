import React, {useEffect} from "react";
import {AllDice} from "./dice";
import {doAction, GameAction} from "../utils/actions";
import GameBoard from "./gameBoard";
import WebSocketService from "../websockets/WebSocketService";
import {getCharacterSpawns, testMap} from "../game/map";
import Player from "../game/player";
import PlayerStats from "../components/playerStats";
import {getDefaultStore, useAtom, useAtomValue} from "jotai";
import {diceAtom, ghostsAtom, playersAtom, selectedDiceAtom} from "../utils/state";
import {CharacterType} from "../game/character";
import GameButton from "./gameButton";

const wsService = new WebSocketService(import.meta.env.VITE_API);

// TODO do not allow players to roll dice multiple times
// TODO fix tailwind colours from getBgCssColour

export const GameComponent: Component<{ player: Player }> = ({player}) => {
  const players = useAtomValue(playersAtom);

  const dice = useAtomValue(diceAtom);
  const [selectedDice, setSelectedDice] = useAtom(selectedDiceAtom);

  function rollDice(): void {
    if (!player.isTurn()) return;

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
        Dice: dice?.length ?? 0 > 0 ? dice : null,
        Players: players,
        Ghosts: getDefaultStore().get(ghostsAtom),
        EatenPellets: eatenPellets
      }
    };
    wsService.send(data);
  }

  async function sendPlayer(): Promise<void> {
    wsService.send({
      Action: GameAction.playerInfo,
      Data: {
        Player: player, Spawns: getCharacterSpawns(testMap)
          .filter(s => s.type === CharacterType.pacMan)
          .map(s => s.position)
      }
    });
  }

  function sendReady(): void {
    wsService.send({Action: GameAction.ready});
  }

  useEffect(() => {
    wsService.onReceive = doAction;
    wsService.open();

    wsService.waitForOpen().then(() => void sendPlayer());

    return () => wsService.close();
  }, []);

  return (
    <>
      <div className={"flex-center"}>
        <GameButton onReadyClick={sendReady} onRollDiceClick={rollDice}/>
      </div>
      <AllDice values={dice}/>
      <div className={"flex justify-center"}>
        {players?.map(p => <PlayerStats key={p.Name} player={p}/>)}
      </div>
      <GameBoard className={"mx-auto my-2"} onMove={onCharacterMove} map={testMap}/>
    </>
  );
};
