import Box from "./box";

export abstract class Character {
  public color: Colour;
  public position: Path;
  public isEatable = false;
  public readonly spawnPosition: DirectionalPosition;

  protected constructor(color: Colour, spawnPosition: DirectionalPosition) {
    this.color = color;
    this.position = {end: spawnPosition.at, direction: spawnPosition.direction};
    this.spawnPosition = spawnPosition;
  }

  public follow(path: Path): void {
    this.position.end = path.end;
    this.position.direction = path.direction;
    this.position.path = undefined;
  }

  public isAt(position: Position): boolean {
    return this.position.end.x === position.x && this.position.end.y === position.y;
  }
}

export class PacMan extends Character {

  public box: Box;

  public constructor(color: Colour, spawnPosition: DirectionalPosition) {
    super(color, spawnPosition);
    this.isEatable = true;
    this.box = new Box(color);
  }

}

export class Ghost extends Character {

  public constructor(color: Colour, spawnPosition: DirectionalPosition) {
    super(color, spawnPosition);
  }
}

export class Dummy extends Character {

  public constructor(position: DirectionalPosition) {
    super("grey", position);
  }

}
