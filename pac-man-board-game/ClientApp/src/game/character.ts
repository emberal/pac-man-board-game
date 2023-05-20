type CharacterColor = "red" | "blue" | "yellow" | "green" | "purple";

export abstract class Character {
  public color: CharacterColor;
  public position: CharacterPosition;

  public constructor(color: CharacterColor, startPosition: CharacterPosition = {x: 0, y: 0}) {
    this.color = color;
    this.position = startPosition;
  }

  public abstract moveTo(position: CharacterPosition): void;
  
  public isAt(position: CharacterPosition): boolean {
    return this.position.x === position.x && this.position.y === position.y;
  }
}

export class PacMan extends Character {
  moveTo(position: CharacterPosition): void {
  }

}

export class Ghost extends Character {
  moveTo(position: CharacterPosition): void {
  }

}
