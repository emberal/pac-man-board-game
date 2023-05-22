type CharacterColor = "red" | "blue" | "yellow" | "green" | "purple";
type Direction = "up" | "right" | "down" | "left";

export abstract class Character {
  public color: CharacterColor;
  public position: Position;
  public direction: Direction = "up";
  public isEatable: boolean = false;

  protected constructor(color: CharacterColor, startPosition: Position = {x: 0, y: 0}) {
    this.color = color;
    this.position = startPosition;
  }

  public moveTo(position: Position): void {
    this.position = position;
  }

  public isAt(position: Position): boolean {
    return this.position.x === position.x && this.position.y === position.y;
  }
}

export class PacMan extends Character {

  constructor(color: CharacterColor, startPosition: Position = {x: 0, y: 0}) {
    super(color, startPosition);
    this.isEatable = true;
  }

}

export class Ghost extends Character {

  constructor(color: CharacterColor, startPosition: Position = {x: 0, y: 0}) {
    super(color, startPosition);
  }
}
