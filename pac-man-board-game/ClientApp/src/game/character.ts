import {Direction} from "./direction";

export enum CharacterType {
  pacMan,
  ghost,
  dummy,
}

export class Character {
  public readonly Colour: Colour;
  public Position: Path | null;
  public IsEatable: boolean;
  public readonly SpawnPosition: DirectionalPosition | null;
  public readonly Type: CharacterType;

  public constructor(
    {
      colour,
      position = null,
      type = CharacterType.dummy,
      isEatable = type === CharacterType.pacMan,
      spawnPosition = null
    }: CharacterProps) {
    this.Colour = colour;
    this.IsEatable = isEatable;
    this.SpawnPosition = spawnPosition;

    this.Position = position ?? spawnPosition ? {
      End: spawnPosition!.At,
      Direction: spawnPosition!.Direction
    } : null;
    this.Type = type;
  }

  public follow(path: Path): void {
    if (!this.Position) {
      this.Position = path;
    } else {
      this.Position.End = path.End;
      this.Position.Direction = path.Direction;
      this.Position.Path = undefined;
    }
  }

  public isPacMan(): boolean {
    return this.Type === CharacterType.pacMan;
  }

  public isGhost(): boolean {
    return this.Type === CharacterType.ghost;
  }

  public moveToSpawn(): void {
    if (!this.SpawnPosition) return;
    this.follow({End: this.SpawnPosition.At, Direction: this.SpawnPosition.Direction});
  }

  public isAt(position: Position): boolean {
    return this.Position !== null && this.Position.End.x === position.x && this.Position.End.y === position.y;
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
      spawnPosition: {At: {x: 0, y: 0}, Direction: Direction.up},
      type: CharacterType.dummy,
    });
  }

}
