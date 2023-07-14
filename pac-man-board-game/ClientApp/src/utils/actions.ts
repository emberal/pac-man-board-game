import Player from "../game/player";
import {CharacterType, Ghost} from "../game/character";
import {getCharacterSpawns, testMap} from "../game/map";
import {TileType} from "../game/tileType";
import {getDefaultStore} from "jotai";
import {currentPlayerAtom, diceAtom, ghostsAtom, playersAtom} from "./state";
import {Colour} from "../game/colour";

export enum GameAction {
  rollDice,
  moveCharacter,
  playerInfo,
  ready,
}

const store = getDefaultStore();

const ghostsProps: CharacterProps[] = [
  {Colour: Colour.Purple},
  {Colour: Colour.Purple},
];
let spawns = getCharacterSpawns(testMap).filter(spawn => spawn.type === CharacterType.ghost);
ghostsProps.forEach(ghost => {
  ghost.SpawnPosition = spawns.pop()?.position;

});
const ghosts = ghostsProps.map(props => new Ghost(props));

store.set(ghostsAtom, ghosts);

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

type MoveCharacterData = { Dice: number[], Players: PlayerProps[], Ghosts: CharacterProps[], EatenPellets: Position[] };

function moveCharacter(data?: MoveCharacterData): void {
  store.set(diceAtom, data?.Dice);
  updatePlayers(data);
  updateGhosts(data);
  removeEatenPellets(data);
}

function updatePlayers(data?: MoveCharacterData): void {
  const updatedPlayers = data?.Players;

  if (updatedPlayers) {
    const newList: Player[] = [];
    for (const player of updatedPlayers) {
      newList.push(new Player(player));
    }
    store.set(playersAtom, newList);
  }
}

function updateGhosts(data?: MoveCharacterData): void {
  const updatedGhosts = data?.Ghosts;

  if (updatedGhosts) {
    const newList: Ghost[] = [];
    for (const ghost of updatedGhosts) {
      newList.push(new Ghost(ghost));
    }
    store.set(ghostsAtom, newList);
  }
}

function removeEatenPellets(data?: MoveCharacterData): void {
  const pellets = data?.EatenPellets;

  for (const pellet of pellets ?? []) {
    testMap[pellet.Y][pellet.X] = TileType.empty;
  }
}

function playerInfo(data?: PlayerProps[]): void {
  const playerProps = data ?? [];
  spawns = getCharacterSpawns(testMap).filter(spawn => spawn.type === CharacterType.pacMan);
  store.set(playersAtom, playerProps.map(p => {
    if (!p.PacMan.SpawnPosition) {
      p.PacMan.SpawnPosition = spawns.pop()?.position;
    }
    return new Player(p);
  }));
}

type ReadyData =
  | { AllReady: true, Starter: PlayerProps, Players: PlayerProps[] }
  | { AllReady: false, Players: PlayerProps[] }
  | string;

function ready(data?: ReadyData): void {
  if (data && typeof data !== "string") {
    if (data.AllReady) {
      store.set(currentPlayerAtom, new Player(data.Starter));
    }
    store.set(playersAtom, data.Players.map(p => new Player(p)));
  }
}
