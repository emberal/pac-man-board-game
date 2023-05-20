type CharacterColor = "red" | "blue" | "yellow" | "green";

export abstract class Character {
  public color: CharacterColor;
  public position: CharacterPosition;

  public constructor(color: CharacterColor, startPosition: CharacterPosition) {
    this.color = color;
    this.position = startPosition;
  }

  public abstract moveTo(position: CharacterPosition): void;
}

export class PacMan extends Character {
  moveTo(position: CharacterPosition): void {
  }

}

export class Ghost extends Character {
  moveTo(position: CharacterPosition): void {
  }

}
