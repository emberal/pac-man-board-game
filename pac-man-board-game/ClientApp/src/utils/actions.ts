import Player from "../game/player";
import {CharacterType, Ghost} from "../game/character";
import {customMap, getCharacterSpawns} from "../game/map";
import {TileType} from "../game/tileType";
import {getDefaultStore} from "jotai";
import {currentPlayerNameAtom, diceAtom, ghostsAtom, playersAtom, rollDiceButtonAtom} from "./state";
import {Colour} from "../game/colour";

export enum GameAction {
  rollDice,
  moveCharacter,
  playerInfo,
  ready,
  nextPlayer,
  disconnect,
}

const store = getDefaultStore();

const ghostsProps: CharacterProps[] = [
  {colour: Colour.purple},
  {colour: Colour.purple},
];
let spawns = getCharacterSpawns(customMap).filter(spawn => spawn.type === CharacterType.ghost);
ghostsProps.forEach(ghost => {
  ghost.spawnPosition = spawns.pop()?.position;

});
const ghosts = ghostsProps.map(props => new Ghost(props));

store.set(ghostsAtom, ghosts);

export const doAction: MessageEventFunction<string> = (event): void => { // TODO divide into smaller functions
  const message: ActionMessage = JSON.parse(event.data);
  console.debug("Received message:", message);

  switch (message.action as GameAction) {
    case GameAction.rollDice:
      setDice(message.data);
      break;
    case GameAction.moveCharacter:
      moveCharacter(message.data);
      break;
    case GameAction.playerInfo:
      playerInfo(message.data);
      break;
    case GameAction.ready:
      ready(message.data);
      break;
    case GameAction.nextPlayer:
      nextPlayer(message.data);
      break;
  }
};

function setDice(data?: number[]): void {
  store.set(diceAtom, data);
}

type MoveCharacterData = { dice: number[], players: PlayerProps[], ghosts: CharacterProps[], eatenPellets: Position[] };

function moveCharacter(data?: MoveCharacterData): void {
  store.set(diceAtom, data?.dice);
  updatePlayers(data);
  updateGhosts(data);
  removeEatenPellets(data);
}

function updatePlayers(data?: MoveCharacterData): void {
  const updatedPlayers = data?.players;

  if (updatedPlayers) {
    const newList: Player[] = updatedPlayers.map(p => new Player(p));
    store.set(playersAtom, newList);
  }
}

function updateGhosts(data?: MoveCharacterData): void {
  const updatedGhosts = data?.ghosts;

  if (updatedGhosts) {
    const newList: Ghost[] = updatedGhosts.map(g => new Ghost(g));
    store.set(ghostsAtom, newList);
  }
}

function removeEatenPellets(data?: MoveCharacterData): void {
  const pellets = data?.eatenPellets;

  for (const pellet of pellets ?? []) {
    customMap[pellet.y][pellet.x] = TileType.empty;
  }
}

function playerInfo(data?: PlayerProps[]): void { // TODO missing data when refreshing page
  const playerProps = data ?? [];
  spawns = getCharacterSpawns(customMap).filter(spawn => spawn.type === CharacterType.pacMan);
  store.set(playersAtom, playerProps.map(p => new Player(p)));
}

type ReadyData = { allReady: boolean, players: PlayerProps[] } | string;

function ready(data?: ReadyData): void {
  if (data && typeof data !== "string") {
    const players = data.players.map(p => new Player(p));
    store.set(playersAtom, players);
    if (data.allReady) {
      store.set(currentPlayerNameAtom, data.players[0].username);
    }
  } else {
    console.error("Error:", data);
  }
}

function nextPlayer(currentPlayerName?: string): void {
  store.set(currentPlayerNameAtom, currentPlayerName);
  store.set(rollDiceButtonAtom, true);
}
