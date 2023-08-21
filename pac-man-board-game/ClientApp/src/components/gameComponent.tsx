import React, {FC, useEffect} from "react";
import {AllDice} from "./dice";
import {doAction, GameAction} from "../utils/actions";
import GameBoard from "./gameBoard";
import WebSocketService from "../websockets/WebSocketService";
import Player from "../game/player";
import PlayerStats from "../components/playerStats";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {diceAtom, ghostsAtom, playersAtom, rollDiceButtonAtom, selectedDiceAtom} from "../utils/state";
import GameButton from "./gameButton";
import {Button} from "./button";
import {useNavigate, useParams} from "react-router-dom";
import {getData} from "../utils/api";

const wsService = new WebSocketService(import.meta.env.VITE_API_WS);

export const GameComponent: FC<{ player: Player, map: GameMap }> = ({player, map}) => {

  const players = useAtomValue(playersAtom);
  const dice = useAtomValue(diceAtom);
  const [selectedDice, setSelectedDice] = useAtom(selectedDiceAtom);
  const setActiveRollDiceButton = useSetAtom(rollDiceButtonAtom);
  const ghosts = useAtomValue(ghostsAtom);

  const navigate = useNavigate();
  const {id} = useParams();

  /**
   * Rolls the dice for the current player's turn.
   */
  function rollDice(): void {
    if (!player.isTurn()) return;

    setSelectedDice(undefined);
    wsService.send({action: GameAction.rollDice});
    setActiveRollDiceButton(false);
  }

  /**
   * Handles the event when the character moves.
   * @param {Position[]} eatenPellets - An array of positions where the pellets have been eaten.
   */
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

  /**
   * Joins a game by sending a WebSocket request to the server.
   */
  function joinGame(): void {
    wsService.send({
      action: GameAction.joinGame,
      data: {
        username: player.username,
        gameId: id,
      } as JoinGameData
    });
  }

  /**
   * Sends a ready action to the WebSocket service.
   */
  function sendReady(): void {
    wsService.send({action: GameAction.ready});
  }

  /**
   * Ends the current turn and sends a message to the web socket service
   * to advance to the next player in the game.
   */
  function endTurn(): void {
    wsService.send({action: GameAction.nextPlayer});
  }

  /**
   * Leaves the current game and navigates to the lobby.
   */
  function leaveGame(): void {
    wsService.send({action: GameAction.disconnect});
    navigate("/lobby");
  }

  useEffect(() => {

    getData(`/game/exists/${id}`)
      .then(res => {
        if (!res.ok) {
          return navigate("/lobby");
        }
        wsService.onReceive = doAction;
        wsService.open();

        wsService.waitForOpen().then(() => joinGame());
      })

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
