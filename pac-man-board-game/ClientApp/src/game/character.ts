type CharacterColor = "red" | "blue" | "yellow" | "green" | "purple";

export abstract class Character {
  public color: CharacterColor;
  public position: Position;

  public constructor(color: CharacterColor, startPosition: Position = {x: 0, y: 0}) {
    this.color = color;
    this.position = startPosition;
  }

  public abstract moveTo(position: Position): void;
  
  public isAt(position: Position): boolean {
    return this.position.x === position.x && this.position.y === position.y;
  }
}

export class PacMan extends Character {
  moveTo(position: Position): void {
    this.position = position;
  }

}

export class Ghost extends Character {
  moveTo(position: Position): void {
    this.position = position;
  }

}
