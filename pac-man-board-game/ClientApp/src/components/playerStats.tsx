import React, {FC} from "react";
import Player, {State} from "../game/player";
import {useAtomValue} from "jotai";
import {currentPlayerNameAtom} from "../utils/state";

const PlayerStats: FC<{ player: Player } & ComponentProps> = (
  {
    player,
    className,
    id
  }) => {
  const currentPlayerName = useAtomValue(currentPlayerNameAtom);
  return (
    <div key={player.Colour}
         className={`w-fit m-2 ${player.State === State.disconnected ? "text-gray-500" : ""} ${className}`} id={id}>
      <p className={player.Username === currentPlayerName ? "underline" : ""}>Player: {player.Username}</p>
      <p>Colour: {player.Colour}</p>
      {player.State === State.inGame || player.State === State.disconnected ?
        <>
          <p>Pellets: {player.Box.count}</p>
          <p>PowerPellets: {player.Box.countPowerPellets}</p>
        </> :
        <p>{player.State === State.waitingForPlayers ? "Waiting" : "Ready"}</p>}
    </div>
  );
};

export default PlayerStats;
