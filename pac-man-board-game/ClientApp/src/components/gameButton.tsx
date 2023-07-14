import React, {MouseEventHandler} from "react";
import {State} from "../game/player";
import {currentPlayerAtom, thisPlayerAtom} from "../utils/state";
import {useAtomValue} from "jotai";

interface GameButtonProps extends ComponentProps {
  onReadyClick?: MouseEventHandler,
  onRollDiceClick?: MouseEventHandler
}

const GameButton: Component<GameButtonProps> = (
  {
    onReadyClick,
    onRollDiceClick,
  }) => {
  const currentPlayer = useAtomValue(currentPlayerAtom);
  const thisPlayer = useAtomValue(thisPlayerAtom);
  
  if (currentPlayer === undefined || currentPlayer.State === State.waitingForPlayers) {
    return <button onClick={onReadyClick}>Ready</button>;
  }
  if (!thisPlayer?.isTurn()) {
    return <button>Please wait</button>;
  }
  return <button onClick={onRollDiceClick}>Roll dice</button>;
};

export default GameButton;
