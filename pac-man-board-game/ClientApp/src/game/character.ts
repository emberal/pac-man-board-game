import { Direction } from "./direction"
import { Colour } from "./colour"

export enum CharacterType {
  pacMan,
  ghost,
  dummy,
}

export class Character implements CharacterProps {
  public readonly colour
  public position
  public isEatable
  public readonly spawnPosition
  public readonly type

  public constructor({
    colour,
    position = null,
    type = CharacterType.dummy,
    isEatable = type === CharacterType.pacMan,
    spawnPosition = null,
  }: CharacterProps) {
    this.colour = colour
    this.isEatable = isEatable
    this.spawnPosition = spawnPosition

    if (position) {
      this.position = position
    } else {
      this.position = spawnPosition ? { end: { ...spawnPosition } } : null
    }

    this.type = type
  }

  public get isPacMan(): boolean {
    return this.type === CharacterType.pacMan
  }

  public get isGhost(): boolean {
    return this.type === CharacterType.ghost
  }

  public follow(path: Path): void {
    if (!this.position) {
      this.position = path
    } else {
      this.position.end = { ...path.end }
      this.position.path = undefined
    }
  }

  public moveToSpawn(): void {
    if (!this.spawnPosition) return
    this.follow({
      end: {
        ...this.spawnPosition,
      },
    })
  }

  public isAt(position: Position): boolean {
    console.debug("isAt", this.position, position)
    return this.position !== null && this.position.end.at.x === position.x && this.position.end.at.y === position.y
  }
}

export class PacMan extends Character implements CharacterProps {
  public constructor({
    colour,
    position,
    isEatable = true,
    spawnPosition,
    type = CharacterType.pacMan,
  }: CharacterProps) {
    super({
      colour: colour,
      position: position,
      isEatable: isEatable,
      spawnPosition: spawnPosition,
      type: type,
    })
  }
}

export class Ghost extends Character implements CharacterProps {
  public constructor({ colour, position, isEatable, spawnPosition, type = CharacterType.ghost }: CharacterProps) {
    super({
      colour: colour,
      position: position,
      isEatable: isEatable,
      spawnPosition: spawnPosition,
      type: type,
    })
  }
}

export class Dummy extends Character implements CharacterProps {
  public constructor(position: Path) {
    super({
      colour: Colour.grey,
      position: position,
      isEatable: false,
      spawnPosition: { at: { x: 0, y: 0 }, direction: Direction.up },
      type: CharacterType.dummy,
    })
  }
}
