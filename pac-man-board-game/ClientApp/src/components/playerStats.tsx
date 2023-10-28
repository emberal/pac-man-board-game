import React, { FC } from "react"
import Player, { State } from "../game/player"
import { useAtomValue } from "jotai"
import { currentPlayerNameAtom } from "../utils/state"

const PlayerStats: FC<{ player: Player } & ComponentProps> = ({ player, className, id }) => {
  const currentPlayerName = useAtomValue(currentPlayerNameAtom)
  return (
    <div
      key={player.colour}
      className={`w-fit m-2 ${player.state === State.disconnected ? "text-gray-500" : ""} ${className}`}
      id={id}>
      <p className={player.username === currentPlayerName ? "underline" : ""}>Player: {player.username}</p>
      <p>Colour: {player.colour}</p>
      {player.state === State.inGame || player.state === State.disconnected ? (
        <>
          <p>Pellets: {player.box.pellets}</p>
          <p>PowerPellets: {player.box.powerPellets}</p>
        </>
      ) : (
        <p>{player.state === State.waitingForPlayers ? "Waiting" : "Ready"}</p>
      )}
    </div>
  )
}

export default PlayerStats
