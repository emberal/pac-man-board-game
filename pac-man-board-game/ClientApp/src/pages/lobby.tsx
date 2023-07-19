import React, {FC, Suspense} from "react";
import {atom, useAtomValue} from "jotai";
import {Button} from "../components/button";
import {thisPlayerAtom} from "../utils/state";

const fetchAtom = atom(async () => {
  const response = await fetch(import.meta.env.VITE_API_HTTP + "/all");
  return await response.json() as Game[];
});
// TODO create game button
const LobbyPage: FC = () => ( // TODO check if player is defined in storage, if not redirect to login
  <Suspense fallback={"Please wait"}>
    <GameTable className={"mx-auto"}/>
  </Suspense>
)

export default LobbyPage;

const GameTable: FC<ComponentProps> = ({className}) => {

  const data = useAtomValue(fetchAtom);
  const thisPlayer = useAtomValue(thisPlayerAtom);

  async function joinGame(gameId: string): Promise<void> {
    if (thisPlayer === undefined) throw new Error("Player is undefined");

    console.debug("Joining game " + gameId);

    const result = await fetch(import.meta.env.VITE_API_HTTP + "/join/" + gameId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(thisPlayer),
    })

    if (result.ok) {
      console.debug("Joined game " + gameId, result.body);
      // TODO redirect to game page
    } else {
      console.error("Failed to join game " + gameId, result.body);
      // TODO show error message
    }
  }

  return (
    <table className={`rounded overflow-hidden ${className}`}>
      <thead className={"bg-gray-500 text-white"}>
      <tr className={"my-5"}>
        <th>Id</th>
        <th>Count</th>
        <th className={"p-2"}>State</th>
        <th>Join</th>
      </tr>
      </thead>
      <tbody>
      {data?.map(game =>
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
      )}
      </tbody>
    </table>
  );
}
