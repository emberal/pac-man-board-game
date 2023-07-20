import {Character, CharacterType} from "./character";
import Box from "./box";
import {Colour} from "./colour";
import {getDefaultStore} from "jotai";
import {currentPlayerNameAtom, playersAtom} from "../utils/state";
import Pellet from "./pellet";
import rules from "./rules";

export enum State {
  waitingForPlayers,
  ready,
  inGame,
  disconnected
}

export default class Player {
  public readonly username: string;
  public readonly pacMan: Character;
  public readonly colour: Colour;
  public readonly box: Box;
  public state: State;

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
    const store = getDefaultStore();
    return store.get(currentPlayerNameAtom) === this.username;
  }

  public addPellet(pellet: Pellet): void {
    this.box.addPellet(pellet);
  }

  public stealFrom(other: Player): void {
    for (let i = 0; i < rules.maxStealPellets; i++) {
      const pellet = other.box.pellets.pop();
      if (pellet)
        this.box.addPellet(pellet);
    }
    const store = getDefaultStore();
    store.set(playersAtom, store.get(playersAtom).map(player => player));
  }

}
