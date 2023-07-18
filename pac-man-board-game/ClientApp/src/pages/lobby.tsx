import React, {Suspense} from "react";
import {atom, useAtomValue} from "jotai";
import {Button} from "../components/Button";

const fetchAtom = atom(async () => {
  const response = await fetch(import.meta.env.VITE_API_HTTP + "/allGames");
  return await response.json() as Game[];
});

const LobbyPage: Component = () => (
  <Suspense fallback={"Please wait"}>
    <GameTable className={"mx-auto"}/>
  </Suspense>
)

export default LobbyPage;

const GameTable: Component = ({className}) => {

  const data = useAtomValue(fetchAtom);

  function joinGame(gameId: string): void {
    console.log("Joining game " + gameId); // TODO: Implement
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
