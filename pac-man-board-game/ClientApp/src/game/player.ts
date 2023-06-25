import {Character, CharacterType} from "./character";
import Box from "./box";

export default class Player {
  public readonly Name: string;
  public readonly PacMan: Character;
  public readonly Colour: Colour;
  public readonly Box: Box;

  constructor(props: PlayerProps) {
    this.Name = props.Name;
    this.Colour = props.Colour;
    this.Box = new Box(props.Box ?? {colour: props.Colour});
    this.PacMan = new Character(props.PacMan ?? {
      Colour: props.Colour,
      Type: CharacterType.pacMan
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
