import React, {FC, MouseEventHandler} from "react";
import {State} from "../game/player";
import {currentPlayerAtom, playersAtom, rollDiceButtonAtom, thisPlayerAtom} from "../utils/state";
import {useAtomValue} from "jotai";
import {Button} from "./button";
import rules from "../game/rules";

interface GameButtonProps extends ComponentProps {
  onReadyClick?: MouseEventHandler,
  onRollDiceClick?: MouseEventHandler
}

const GameButton: FC<GameButtonProps> = (
  {
    onReadyClick,
    onRollDiceClick,
  }) => {

  const currentPlayer = useAtomValue(currentPlayerAtom);
  const thisPlayer = useAtomValue(thisPlayerAtom);
  const players = useAtomValue(playersAtom);
  const activeRollDiceButton = useAtomValue(rollDiceButtonAtom);

  if (players.length >= rules.minPlayers && (currentPlayer === undefined || currentPlayer.State === State.waitingForPlayers)) {
    return <Button onClick={onReadyClick}>Ready</Button>;
  }
  if (!thisPlayer?.isTurn()) { // TODO also show when waiting for other players
    return <Button disabled>Please wait</Button>;
  }
  return <Button onClick={onRollDiceClick} disabled={!activeRollDiceButton}>Roll dice</Button>;
};

export default GameButton;
