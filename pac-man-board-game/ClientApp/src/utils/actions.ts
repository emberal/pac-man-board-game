import Player from "../game/player";
import {Character, PacMan} from "../game/character";
import {testMap} from "../game/map";
import {TileType} from "../game/tileType";

export enum GameAction {
  rollDice,
  moveCharacter,
  playerInfo,
  ready,
}

function doAction(message: MessageEvent<string>): void { // TODO Jotai state management?
  const parsed: ActionMessage = JSON.parse(message.data);

  switch (parsed.Action) {
    case GameAction.rollDice:
      setDice(parsed.Data as number[]);
      break;
    case GameAction.moveCharacter:
      setDice(parsed.Data?.dice as number[]);
      updateCharacters(parsed);
      removeEatenPellets(parsed);
      break;
    case GameAction.playerInfo:
      const playerProps = parsed.Data as PlayerProps[];
      console.log(playerProps);
      setPlayers(playerProps.map(p => new Player(p)));
      const pacMen = playerProps.filter(p => p.PacMan).map(p => new PacMan(p.PacMan!));
      console.log(pacMen);
      // TODO find spawn points
      setCharacters([...pacMen, ...ghosts]);
      break;
    case GameAction.ready:
      const isReady = parsed.Data.AllReady as boolean;
      if (isReady) {
        setCurrentPlayer(new Player(parsed.Data.Starter as PlayerProps));
      }
      setPlayers((parsed.Data.Players as PlayerProps[]).map(p => new Player(p)));
      break;
  }
}

function removeEatenPellets(parsed: ActionMessage): void {
  const pellets = parsed.Data?.eatenPellets as Position[];

  for (const pellet of pellets) {
    testMap[pellet.y][pellet.x] = TileType.empty;
  }
}

function updateCharacters(parsed: ActionMessage): void {
  const updatedCharacters = parsed.Data?.characters as CharacterProps[] | undefined;

  if (updatedCharacters) {
    const newList: Character[] = [];
    for (const character of updatedCharacters) {
      newList.push(new Character(character));
    }
    setCharacters(newList);
  }
}
