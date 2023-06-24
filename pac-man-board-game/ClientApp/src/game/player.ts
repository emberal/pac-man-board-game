import {Character, CharacterType} from "./character";
import Box from "./box";

export default class Player {
  public readonly Name: string;
  public readonly PacMan: Character;
  public readonly Colour: Colour;
  public readonly Box: Box;

  constructor(props: PlayerProps) {
    this.Name = props.name;
    this.Colour = props.colour;
    this.Box = new Box(props.box ?? {colour: props.colour});
    this.PacMan = new Character(props.pacMan ?? {
      colour: props.colour,
      type: CharacterType.pacMan
    });
  }

  public stealFrom(other: Player): void {
    for (let i = 0; i < 2; i++) {
      const pellet = other.Box.Pellets.pop();
      if (pellet)
        this.Box.addPellet(pellet);
    }
  }

}
