import {Direction} from "./direction";
import {Colour} from "./colour";

export enum CharacterType {
  pacMan,
  ghost,
  dummy,
}

export class Character {
  public readonly colour: Colour;
  public position: Path | null;
  public isEatable: boolean;
  public readonly spawnPosition: DirectionalPosition | null;
  public readonly type: CharacterType;

  public constructor(
    {
      colour,
      position = null,
      type = CharacterType.dummy,
      isEatable = type === CharacterType.pacMan,
      spawnPosition = null
    }: CharacterProps) {
    this.colour = colour;
    this.isEatable = isEatable;
    this.spawnPosition = spawnPosition;

    if (position) {
      this.position = position;
    } else {
      this.position = spawnPosition ? {
        end: spawnPosition!.at,
        direction: spawnPosition!.direction
      } : null;
    }

    this.type = type;
  }

  public follow(path: Path): void {
    if (!this.position) {
      this.position = path;
    } else {
      this.position.end = path.end;
      this.position.direction = path.direction;
      this.position.path = undefined;
    }
  }

  public isPacMan(): boolean {
    return this.type === CharacterType.pacMan;
  }

  public isGhost(): boolean {
    return this.type === CharacterType.ghost;
  }

  public moveToSpawn(): void {
    if (!this.spawnPosition) return;
    this.follow({end: this.spawnPosition.at, direction: this.spawnPosition.direction});
  }

  public isAt(position: Position): boolean {
    return this.position !== null && this.position.end.x === position.x && this.position.end.y === position.y;
  }
}

export class PacMan extends Character {

  public constructor({colour, position, isEatable = true, spawnPosition, type = CharacterType.pacMan}: CharacterProps) {
    super({colour: colour, position: position, isEatable: isEatable, spawnPosition: spawnPosition, type: type});
  }

}

export class Ghost extends Character {

  public constructor({colour, position, isEatable, spawnPosition, type = CharacterType.ghost}: CharacterProps) {
    super({colour: colour, position: position, isEatable: isEatable, spawnPosition: spawnPosition, type: type});
  }
}

export class Dummy extends Character {

  public constructor(position: Path) { // TODO see-through
    super({
      colour: Colour.grey,
      position: position,
      isEatable: false,
      spawnPosition: {at: {x: 0, y: 0}, direction: Direction.up},
      type: CharacterType.dummy,
    });
  }

}
