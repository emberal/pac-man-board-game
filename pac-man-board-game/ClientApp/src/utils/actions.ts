import Player from "../game/player";
import {Character, CharacterType, Ghost, PacMan} from "../game/character";
import {getCharacterSpawns, testMap} from "../game/map";
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

const ghostsProps: CharacterProps[] = [
  {Colour: Colour.Purple},
  {Colour: Colour.Purple},
];

let spawns = getCharacterSpawns(testMap).filter(spawn => spawn.type === CharacterType.ghost);
ghostsProps.forEach(ghost => {
  ghost.SpawnPosition = spawns.pop()?.position;
});

const ghosts = ghostsProps.map(props => new Ghost(props));

const store = getDefaultStore();

export const doAction: MessageEventFunction<string> = (event): void => { // TODO divide into smaller functions
  const message: ActionMessage = JSON.parse(event.data);
  console.debug("Received message:", message);

  switch (message.Action as GameAction) {
    case GameAction.rollDice:
      setDice(message.Data);
      break;
    case GameAction.moveCharacter:
      moveCharacter(message.Data);
      break;
    case GameAction.playerInfo:
      playerInfo(message.Data);
      break;
    case GameAction.ready:
      ready(message.Data);
      break;
  }
};

function setDice(data?: number[]): void {
  store.set(diceAtom, data);
}

type MoveCharacterData = { dice: number[], characters: CharacterProps[], eatenPellets: Position[] };

function moveCharacter(data?: MoveCharacterData): void {
  store.set(diceAtom, data?.dice);
  updateCharacters(data);
  removeEatenPellets(data);
}

function updateCharacters(data?: MoveCharacterData): void {
  const updatedCharacters = data?.characters;

  if (updatedCharacters) {
    const newList: Character[] = [];
    for (const character of updatedCharacters) {
      newList.push(new Character(character));
    }
    store.set(charactersAtom, newList);
  }
}

function removeEatenPellets(data?: MoveCharacterData): void {
  const pellets = data?.eatenPellets;

  for (const pellet of pellets ?? []) {
    testMap[pellet.y][pellet.x] = TileType.empty;
  }
}

function playerInfo(data?: PlayerProps[]): void {
  const playerProps = data ?? [];
  store.set(playersAtom, playerProps.map(p => new Player(p)));

  spawns = getCharacterSpawns(testMap).filter(spawn => spawn.type === CharacterType.pacMan);
  const pacMen = playerProps.filter(p => p.PacMan).map(p => {
    if (!p.PacMan!.SpawnPosition) {
      p.PacMan!.SpawnPosition = spawns.pop()?.position;
    }
    return new PacMan(p.PacMan!);
  });

  store.set(charactersAtom, [...pacMen, ...ghosts]);
}


type ReadyData =
  | { AllReady: true, Starter: PlayerProps, Players: PlayerProps[] }
  | { AllReady: false, Players: PlayerProps[] }
  | string;

function ready(data?: ReadyData): void {
  if (data && typeof data !== "string") {
    const isReady = data.AllReady;
    if (isReady) {
      store.set(currentPlayerAtom, new Player(data.Starter));
    }
    store.set(playersAtom, data.Players.map(p => new Player(p)));
  }
}
