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
  public readonly Username: string;
  public readonly PacMan: Character;
  public readonly Colour: Colour;
  public readonly Box: Box;
  public State: State;

  constructor(props: PlayerProps) {
    this.Username = props.Username;
    this.Colour = props.Colour;
    this.Box = new Box(props.Box ?? {Colour: props.Colour});
    this.PacMan = new Character(props.PacMan ?? {
      Colour: props.Colour,
      Type: CharacterType.pacMan
    });
    this.State = props.State ?? State.waitingForPlayers;
  }

  public isTurn(): boolean {
    const store = getDefaultStore();
    return store.get(currentPlayerNameAtom) === this.Username;
  }

  public addPellet(pellet: Pellet): void {
    this.Box.addPellet(pellet);
  }

  public stealFrom(other: Player): void {
    for (let i = 0; i < rules.maxStealPellets; i++) {
      const pellet = other.Box.Pellets.pop();
      if (pellet)
        this.Box.addPellet(pellet);
    }
    const store = getDefaultStore();
    store.set(playersAtom, store.get(playersAtom).map(player => player));
  }

}
