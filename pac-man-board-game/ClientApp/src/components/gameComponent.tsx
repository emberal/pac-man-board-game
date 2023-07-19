import React, {useEffect} from "react";
import {AllDice} from "./dice";
import {doAction, GameAction} from "../utils/actions";
import GameBoard from "./gameBoard";
import WebSocketService from "../websockets/WebSocketService";
import {getCharacterSpawns} from "../game/map";
import Player from "../game/player";
import PlayerStats from "../components/playerStats";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {diceAtom, ghostsAtom, playersAtom, rollDiceButtonAtom, selectedDiceAtom} from "../utils/state";
import {CharacterType} from "../game/character";
import GameButton from "./gameButton";

const wsService = new WebSocketService(import.meta.env.VITE_API_WS);

// TODO bug, when taking player on last dice, the currentPlayer changes and the wrong character get to steal
// TODO bug, first player can sometimes roll dice twice (maybe only on firefox)
// TODO bug, when refreshing page, the characters are reset for all players
// TODO bug, when refreshing page, some data is missing until other clients make a move

// TODO add debug menu on dev, for testing and cheating
// TODO join/new game lobby
// TODO sign up player page
// TODO sign in page
// TODO show box with collected pellets
// TODO layout

export const GameComponent: Component<{ player: Player, map: GameMap }> = ({player, map}) => {

  const players = useAtomValue(playersAtom);
  const dice = useAtomValue(diceAtom);
  const [selectedDice, setSelectedDice] = useAtom(selectedDiceAtom);
  const setActiveRollDiceButton = useSetAtom(rollDiceButtonAtom);
  const ghosts = useAtomValue(ghostsAtom);

  function rollDice(): void {
    if (!player.isTurn()) return;

    setSelectedDice(undefined);
    wsService.send({Action: GameAction.rollDice});
    setActiveRollDiceButton(false);
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
        Ghosts: ghosts,
        EatenPellets: eatenPellets
      }
    };
    wsService.send(data);

    if (dice?.length === 0) {
      endTurn();
    }
  }

  function sendPlayer(): void {
    wsService.send({
      Action: GameAction.playerInfo,
      Data: {
        Player: player, Spawns: getCharacterSpawns(map)
          .filter(s => s.type === CharacterType.pacMan)
          .map(s => s.position)
      }
    });
  }

  function sendReady(): void {
    wsService.send({Action: GameAction.ready});
  }

  function endTurn(): void {
    wsService.send({Action: GameAction.nextPlayer});
  }

  useEffect(() => {
    wsService.onReceive = doAction;
    wsService.open();

    wsService.waitForOpen().then(() => sendPlayer());

    return () => wsService.close();
  }, []);

  return (
    <>
      <div className={"flex justify-center"}>
        {players?.map(p => <PlayerStats key={p.UserName} player={p}/>)}
      </div>
      <div className={"flex-center"}>
        <GameButton onReadyClick={sendReady} onRollDiceClick={rollDice}/>
      </div>
      <AllDice values={dice}/>
      <GameBoard className={"mx-auto my-2"} onMove={onCharacterMove} map={map}/>
    </>
  );
};
