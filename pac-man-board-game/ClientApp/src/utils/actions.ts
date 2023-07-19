import Player from "../game/player";
import {CharacterType, Ghost} from "../game/character";
import {getCharacterSpawns, testMap} from "../game/map";
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
    case GameAction.nextPlayer:
      nextPlayer(message.Data);
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
    const newList: Player[] = updatedPlayers.map(p => new Player(p));
    store.set(playersAtom, newList);
  }
}

function updateGhosts(data?: MoveCharacterData): void {
  const updatedGhosts = data?.Ghosts;

  if (updatedGhosts) {
    const newList: Ghost[] = updatedGhosts.map(g => new Ghost(g));
    store.set(ghostsAtom, newList);
  }
}

function removeEatenPellets(data?: MoveCharacterData): void {
  const pellets = data?.EatenPellets;

  for (const pellet of pellets ?? []) {
    testMap[pellet.Y][pellet.X] = TileType.empty;
  }
}

function playerInfo(data?: PlayerProps[]): void { // TODO missing data when refreshing page
  const playerProps = data ?? [];
  spawns = getCharacterSpawns(testMap).filter(spawn => spawn.type === CharacterType.pacMan);
  store.set(playersAtom, playerProps.map(p => new Player(p)));
}

type ReadyData = { AllReady: boolean, Players: PlayerProps[] } | string;

function ready(data?: ReadyData): void {
  if (data && typeof data !== "string") {
    const players = data.Players.map(p => new Player(p));
    store.set(playersAtom, players);
    if (data.AllReady) {
      store.set(currentPlayerNameAtom, data.Players[0].Username);
    }
  } else {
    console.error("Error:", data);
  }
}

function nextPlayer(currentPlayerName?: string): void {
  store.set(currentPlayerNameAtom, currentPlayerName);
  store.set(rollDiceButtonAtom, true);
}
