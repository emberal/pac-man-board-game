import React, {FC, useEffect} from "react";
import {AllDice} from "./dice";
import {doAction, GameAction} from "../utils/actions";
import GameBoard from "./gameBoard";
import WebSocketService from "../websockets/WebSocketService";
import {getPacManSpawns} from "../game/map";
import Player from "../game/player";
import PlayerStats from "../components/playerStats";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {diceAtom, ghostsAtom, playersAtom, rollDiceButtonAtom, selectedDiceAtom} from "../utils/state";
import GameButton from "./gameButton";
import {Button} from "./button";
import {useNavigate} from "react-router-dom";

const wsService = new WebSocketService(import.meta.env.VITE_API_WS);

// TODO bug, when taking player on last dice, the currentPlayer changes and the wrong character gets to steal
// TODO bug, first player can sometimes roll dice twice
// TODO bug, when refreshing page, some data is missing until other clients make a move
// TODO bug, teleportation doesn't work

// TODO guest users
// TODO store map in backend and save it in state on each client
// TODO add debug menu on dev, for testing and cheating
// TODO sign up player page
// TODO show box with collected pellets
// TODO layout

export const GameComponent: FC<{ player: Player, map: GameMap }> = ({player, map}) => {

  const players = useAtomValue(playersAtom);
  const dice = useAtomValue(diceAtom);
  const [selectedDice, setSelectedDice] = useAtom(selectedDiceAtom);
  const setActiveRollDiceButton = useSetAtom(rollDiceButtonAtom);
  const ghosts = useAtomValue(ghostsAtom);

  const navigate = useNavigate();

  function rollDice(): void {
    if (!player.isTurn()) return;

    setSelectedDice(undefined);
    wsService.send({action: GameAction.rollDice});
    setActiveRollDiceButton(false);
  }

  function onCharacterMove(eatenPellets: Position[]): void {
    if (dice && selectedDice) {
      dice.splice(selectedDice.index, 1);
    }
    setSelectedDice(undefined);
    const data: ActionMessage = {
      action: GameAction.moveCharacter,
      data: {
        dice: dice?.length ?? 0 > 0 ? dice : null,
        players: players,
        ghosts: ghosts,
        eatenPellets: eatenPellets
      }
    };
    wsService.send(data);

    if (dice?.length === 0) {
      endTurn();
    }
  }

  function sendPlayer(): void {
    wsService.send({
      action: GameAction.playerInfo,
      data: {
        player: player, spawns: getPacManSpawns(map)
      } as PlayerInfoData
    });
  }

  function sendReady(): void {
    wsService.send({action: GameAction.ready});
  }

  function endTurn(): void {
    wsService.send({action: GameAction.nextPlayer});
  }

  function leaveGame(): void {
    wsService.send({action: GameAction.disconnect});
    navigate("/lobby");
  }

  useEffect(() => {
    wsService.onReceive = doAction;
    wsService.open();

    wsService.waitForOpen().then(() => sendPlayer());

    return () => wsService.close();
  }, []);

  return (
    <>
      <Button onClick={leaveGame}>Leave game</Button>
      <div className={"flex justify-center"}>
        {players?.map(p => <PlayerStats key={p.username} player={p}/>)}
      </div>
      <div className={"flex-center"}>
        <GameButton onReadyClick={sendReady} onRollDiceClick={rollDice}/>
      </div>
      <AllDice values={dice}/>
      <GameBoard className={"mx-auto my-2"} onMove={onCharacterMove} map={map}/>
    </>
  );
};
