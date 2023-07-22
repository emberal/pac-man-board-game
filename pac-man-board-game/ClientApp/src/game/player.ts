import {Character, CharacterType} from "./character";
import Box from "./box";
import {getDefaultStore} from "jotai";
import {currentPlayerNameAtom, playersAtom} from "../utils/state";
import rules from "./rules";

export enum State {
  waitingForPlayers,
  ready,
  inGame,
  disconnected
}

export default class Player implements PlayerProps {
  private static store = getDefaultStore();
  public readonly username;
  public readonly pacMan;
  public readonly colour;
  public readonly box;
  public state;

  constructor(props: PlayerProps) {
    this.username = props.username;
    this.colour = props.colour;
    this.box = new Box(props.box ?? {colour: props.colour});
    this.pacMan = new Character(props.pacMan ?? {
      colour: props.colour,
      type: CharacterType.pacMan
    });
    this.state = props.state ?? State.waitingForPlayers;
  }

  public isTurn(): boolean {
    return Player.store.get(currentPlayerNameAtom) === this.username;
  }

  public addPellet(): void {
    this.box.addPellet();
  }

  public addPowerPellet(): void {
    this.box.addPowerPellet();
  }

  public stealFrom(other: Player): void {
    for (let i = 0; i < rules.maxStealPellets; i++) {
      const removed = other.box.removePellet();
      if (removed)
        this.box.addPellet();
    }
    Player.store.set(playersAtom, Player.store.get(playersAtom).map(player => player));
  }

}
