type CharacterColor = "red" | "blue" | "yellow" | "green" | "purple";

const defaultDirection: Path = {
  end: {x: 0, y: 0},
  direction: "up"
};

export abstract class Character {
  public color: CharacterColor;
  public position: Path;
  public isEatable: boolean = false;

  protected constructor(color: CharacterColor, startPosition = defaultDirection) {
    this.color = color;
    this.position = startPosition;
  }

  public follow(path: Path): void {
    this.position.end = path.end;
    this.position.direction = path.direction;
  }

  public isAt(position: Position): boolean {
    return this.position.end.x === position.x && this.position.end.y === position.y;
  }
}

export class PacMan extends Character {

  constructor(color: CharacterColor, startPosition = defaultDirection) {
    super(color, startPosition);
    this.isEatable = true;
  }

}

export class Ghost extends Character {

  constructor(color: CharacterColor, startPosition = defaultDirection) {
    super(color, startPosition);
  }
}
