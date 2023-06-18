import {Direction} from "./direction";

export enum CharacterType {
  pacMan = "pacMan",
  ghost = "ghost",
  dummy = "dummy",
}

export class Character {
  public readonly colour: Colour;
  public position: Path;
  public isEatable: boolean;
  public readonly spawnPosition: DirectionalPosition;
  public readonly type: CharacterType;

  public constructor(
    {
      colour,
      position,
      type = CharacterType.dummy,
      isEatable = type === CharacterType.pacMan,
      spawnPosition
    }: CharacterProps) {
    this.colour = colour;
    this.position = position ?? {end: spawnPosition.at, direction: spawnPosition.direction};
    this.isEatable = isEatable;
    this.spawnPosition = spawnPosition;
    this.type = type;
  }

  public follow(path: Path): void {
    this.position.end = path.end;
    this.position.direction = path.direction;
    this.position.path = undefined;
  }

  public isPacMan(): boolean {
    return this.type === CharacterType.pacMan;
  }

  public isGhost(): boolean {
    return this.type === CharacterType.ghost;
  }

  public moveToSpawn(): void {
    this.follow({end: this.spawnPosition.at, direction: this.spawnPosition.direction});
  }

  public isAt(position: Position): boolean {
    return this.position.end.x === position.x && this.position.end.y === position.y;
  }
}

export class PacMan extends Character {

  public constructor({colour, position, isEatable = true, spawnPosition, type = CharacterType.pacMan}: CharacterProps) {
    super({colour, position, isEatable, spawnPosition, type});
  }

}

export class Ghost extends Character {

  public constructor({colour, position, isEatable, spawnPosition, type = CharacterType.ghost}: CharacterProps) {
    super({colour, position, isEatable, spawnPosition, type});
  }
}

export class Dummy extends Character {

  public constructor(position: Path) { // TODO see-through
    super({
      colour: "grey",
      position,
      isEatable: false,
      spawnPosition: {at: {x: 0, y: 0}, direction: Direction.up},
      type: CharacterType.dummy,
    });
  }

}
