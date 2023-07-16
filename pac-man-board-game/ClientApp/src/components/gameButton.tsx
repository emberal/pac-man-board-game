import React, {MouseEventHandler} from "react";
import {State} from "../game/player";
import {currentPlayerAtom, rollDiceButtonAtom, thisPlayerAtom} from "../utils/state";
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
  const activeRollDiceButton = useAtomValue(rollDiceButtonAtom);

  if (currentPlayer === undefined || currentPlayer.State === State.waitingForPlayers) {
    return <button onClick={onReadyClick}>Ready</button>;
  }
  if (!thisPlayer?.isTurn()) { // TODO also show when waiting for other players
    return <button disabled>Please wait</button>;
  }
  return <button onClick={onRollDiceClick} disabled={!activeRollDiceButton}>Roll dice</button>;
};

export default GameButton;
