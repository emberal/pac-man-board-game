import Box from "./box";
import {Direction} from "./direction";

export abstract class Character {
  public readonly colour: Colour;
  public position: Path;
  public isEatable: boolean;
  public readonly spawnPosition: DirectionalPosition;

  protected constructor({colour, position, isEatable = false, spawnPosition}: CharacterProps) {
    this.colour = colour;
    this.position = position ?? {end: spawnPosition.at, direction: spawnPosition.direction};
    this.isEatable = isEatable;
    this.spawnPosition = spawnPosition;
  }

  public follow(path: Path): void {
    this.position.end = path.end;
    this.position.direction = path.direction;
    this.position.path = undefined;
  }

  public moveToSpawn(): void {
    this.follow({end: this.spawnPosition.at, direction: this.spawnPosition.direction});
  }

  public isAt(position: Position): boolean {
    return this.position.end.x === position.x && this.position.end.y === position.y;
  }
}

export class PacMan extends Character {

  public box: Box;

  public constructor({colour, position, isEatable = true, spawnPosition, box = {colour}}: PacManProps) {
    super({colour, position, isEatable, spawnPosition});
    this.isEatable = isEatable;
    this.box = new Box(box);
  }
  
  public stealFrom(other: PacMan): void {
    
  }

}

export class Ghost extends Character {

  public constructor({colour, position, isEatable, spawnPosition}: CharacterProps) {
    super({colour, position, isEatable, spawnPosition});
  }
}

export class Dummy extends Character {

  public constructor(position: Path) { // TODO see-through
    super({colour: "grey", position, isEatable: false, spawnPosition: {at: {x: 0, y: 0}, direction: Direction.up}});
  }

}
