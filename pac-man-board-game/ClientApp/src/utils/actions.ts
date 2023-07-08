import Player from "../game/player";
import {Character, Ghost, PacMan} from "../game/character";
import {testMap} from "../game/map";
import {TileType} from "../game/tileType";
import {getDefaultStore} from "jotai";
import {charactersAtom, currentPlayerAtom, diceAtom, playersAtom} from "./state";
import {Colour} from "../game/colour";

export enum GameAction {
  rollDice,
  moveCharacter,
  playerInfo,
  ready,
}

const ghosts = [
  new Ghost({Colour: Colour.Purple}),
  new Ghost({Colour: Colour.Purple}),
];

const store = getDefaultStore();

export const doAction: MessageEventFunction<string> = (message): void => { // TODO divide into smaller functions
  const parsed: ActionMessage = JSON.parse(message.data);

  switch (parsed.Action as GameAction) {
    case GameAction.rollDice:
      store.set(diceAtom, parsed.Data as number[]);
      break;
    case GameAction.moveCharacter:
      store.set(diceAtom, parsed.Data?.dice as number[]);
      updateCharacters(parsed);
      removeEatenPellets(parsed);
      break;
    case GameAction.playerInfo:
      const playerProps = parsed.Data as PlayerProps[];
      console.log(playerProps);
      store.set(playersAtom, playerProps.map(p => new Player(p)));
      const pacMen = playerProps.filter(p => p.PacMan).map(p => new PacMan(p.PacMan!));
      console.log(pacMen);
      // TODO find spawn points
      store.set(charactersAtom, [...pacMen, ...ghosts]);
      break;
    case GameAction.ready:
      const isReady = parsed.Data.AllReady as boolean;
      if (isReady) {
        store.set(currentPlayerAtom, new Player(parsed.Data.Starter as PlayerProps));
      }
      store.set(playersAtom, (parsed.Data.Players as PlayerProps[]).map(p => new Player(p)));
      break;
  }
};

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
    store.set(charactersAtom, newList);
  }
}
