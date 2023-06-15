import {Character, Ghost, PacMan} from "./character";
import Box from "./box";

export default class Player {
  public readonly character: Character;
  public readonly colour: Colour;
  public readonly box: Box;

  constructor(props: PlayerProps) {
    this.colour = props.colour;
    this.box = new Box(props.box);
    this.character = "box" in props.character ? new PacMan(props.character) : new Ghost(props.character); // TODO move box here
  }

  public stealFrom(other: Player): void {

  }
  
}
