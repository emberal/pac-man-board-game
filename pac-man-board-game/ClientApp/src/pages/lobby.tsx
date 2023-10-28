import React, { FC, Suspense } from "react"
import { atom, useAtomValue } from "jotai"
import { Button } from "../components/button"
import { selectedMapAtom, thisPlayerAtom } from "../utils/state"
import { getData, postData } from "../utils/api"
import { getPacManSpawns } from "../game/map"
import { useNavigate } from "react-router-dom"

const fetchAtom = atom(async () => {
  const response = await getData("/game/all")
  return (await response.json()) as Game[]
})

const LobbyPage: FC = () => {
  const thisPlayer = useAtomValue(thisPlayerAtom)
  const navigate = useNavigate()
  const map = useAtomValue(selectedMapAtom)

  async function createGame(): Promise<void> {
    const response = await postData("/game/create", {
      body: {
        player: thisPlayer,
        spawns: getPacManSpawns(map),
      } as CreateGameData,
    })

    if (response.ok) {
      const data = await response.json()
      navigate("/game/" + data.id)
    } else {
      const data = await response.text()
      console.error("Error: ", data)
      // TODO display error
    }
  }

  return (
    <>
      <Button onClick={createGame}>New game</Button>
      <Suspense fallback={"Please wait"}>
        <GameTable className={"mx-auto"} />
      </Suspense>
    </>
  )
}

export default LobbyPage

const GameTable: FC<ComponentProps> = ({ className }) => {
  const data = useAtomValue(fetchAtom)
  const thisPlayer = useAtomValue(thisPlayerAtom)
  const navigate = useNavigate()

  async function joinGame(gameId: string): Promise<void> {
    if (thisPlayer === undefined) throw new Error("Player is undefined")

    const result = await postData("/game/join/" + gameId, { body: thisPlayer })

    if (result.ok) {
      navigate("/game/" + gameId)
    } else {
      console.error("Failed to join game " + gameId, await result.text())
      // TODO show error message
    }
  }

  return (
    <table className={`rounded overflow-hidden ${className}`}>
      <thead className={"bg-gray-500 text-white"}>
        <tr className={"my-5"}>
          <th className={"p-2"}>Id</th>
          <th className={"p-2"}>Count</th>
          <th className={"p-2"}>State</th>
          <th className={"p-2"}>Join</th>
        </tr>
      </thead>
      <tbody>
        {data?.map(game => (
          <tr key={game.id} className={"even:bg-gray-200"}>
            <td className={"p-2"}>{game.id}</td>
            <td className={"text-center"}>{game.count}</td>
            <td>{game.isGameStarted ? "Closed" : "Open"}</td>
            <td className={"p-2"}>
              <Button disabled={game.isGameStarted} onClick={() => joinGame(game.id)}>
                Join
              </Button>
            </td>
          </tr>
        ))}
        {data?.length === 0 && (
          <tr>
            <td colSpan={4} className={"text-center"}>
              No games found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
