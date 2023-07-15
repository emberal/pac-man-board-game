import {Direction} from "./direction";
import {Colour} from "./colour";

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
      Colour,
      Position = null,
      Type = CharacterType.dummy,
      IsEatable = Type === CharacterType.pacMan,
      SpawnPosition = null
    }: CharacterProps) {
    this.Colour = Colour;
    this.IsEatable = IsEatable;
    this.SpawnPosition = SpawnPosition;

    if (Position) {
      this.Position = Position;
    } else {
      this.Position = SpawnPosition ? {
        End: SpawnPosition!.At,
        Direction: SpawnPosition!.Direction
      } : null;
    }

    this.Type = Type;
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
    return this.Position !== null && this.Position.End.X === position.X && this.Position.End.Y === position.Y;
  }
}

export class PacMan extends Character {

  public constructor({Colour, Position, IsEatable = true, SpawnPosition, Type = CharacterType.pacMan}: CharacterProps) {
    super({Colour: Colour, Position: Position, IsEatable: IsEatable, SpawnPosition: SpawnPosition, Type: Type});
  }

}

export class Ghost extends Character {

  public constructor({Colour, Position, IsEatable, SpawnPosition, Type = CharacterType.ghost}: CharacterProps) {
    super({Colour: Colour, Position: Position, IsEatable: IsEatable, SpawnPosition: SpawnPosition, Type: Type});
  }
}

export class Dummy extends Character {

  public constructor(position: Path) { // TODO see-through
    super({
      Colour: Colour.Grey,
      Position: position,
      IsEatable: false,
      SpawnPosition: {At: {X: 0, Y: 0}, Direction: Direction.up},
      Type: CharacterType.dummy,
    });
  }

}
