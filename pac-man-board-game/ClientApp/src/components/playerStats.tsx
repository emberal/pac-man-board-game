import React from "react";
import Player, {State} from "../game/player";

export interface PlayerStatsProps extends ComponentProps {
  player: Player,
  isCurrentPlayer?: boolean,
}

const PlayerStats: Component<PlayerStatsProps> = (
  {
    player,
    isCurrentPlayer = false,
    className,
    id
  }) => (
  <div key={player.Colour} className={`mx-auto w-fit m-2 ${className}`} id={id}>
    <p className={isCurrentPlayer ? "underline" : ""}>Player: {player.Name}</p>
    <p>Colour: {player.Colour}</p>
    {player.State === State.inGame ?
      <>
        <p>Pellets: {player.Box.count}</p>
        <p>PowerPellets: {player.Box.countPowerPellets}</p>
      </> :
      <p>{player.State === State.waitingForPlayers ? "Waiting" : "Ready"}</p>}

  </div>
);

export default PlayerStats;
