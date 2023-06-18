import {Character, CharacterType} from "./character";
import Box from "./box";
import {Direction} from "./direction";

export default class Player {
  public readonly pacMan: Character;
  public readonly colour: Colour;
  public readonly box: Box;

  constructor(props: PlayerProps) {
    this.colour = props.colour;
    this.box = new Box(props.box ?? {colour: props.colour});
    this.pacMan = new Character(props.pacMan ?? {
      colour: props.colour,
      spawnPosition: {at: {x: 0, y: 0}, direction: Direction.up},
      type: CharacterType.pacMan
    });
  }

  public stealFrom(other: Player): void {
    for (let i = 0; i < 2; i++) {
      const pellet = other.box.pellets.pop();
      if (pellet)
        this.box.addPellet(pellet);
    }
  }

}
