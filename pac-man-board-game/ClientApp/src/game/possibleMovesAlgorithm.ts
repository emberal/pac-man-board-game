import {TileType} from "./tileType";
import {Character} from "./character";
import {Direction, getDirections} from "./direction";

// TODO if a Pac-Man with a powerpellet hits a ghost, the Pac-Man can't walk further

/**
 * Finds all the possible positions for the character to move to
 * @param board The board the character is on
 * @param character The current position of the character
 * @param steps The number of steps the character can move
 * @param characters All the characters on the board
 * @returns An array of paths the character can move to
 */
export default function findPossiblePositions(board: GameMap, character: Character, steps: number, characters: Character[]): Path[] {
  if (!character.Position || !character.SpawnPosition) throw new Error("Character has no position or spawn position");
  return findPossibleRecursive(board, character.Position, steps, character, characters);
};

/**
 * Uses recursion to move through the board and find all the possible positions
 * @param board The board the character is on
 * @param currentPath The current path the character is on
 * @param steps The number of steps the character can move
 * @param character The current character
 * @param characters
 * @returns An array of paths the character can move to
 */
function findPossibleRecursive(board: GameMap, currentPath: Path, steps: number, character: Character, characters: Character[]): Path[] {

  const paths: Path[] = [];
  if (isOutsideBoard(currentPath, board.length)) {
    if (character.isPacMan()) {
      return addTeleportationTiles(board, currentPath, steps, character, characters);
    }
  } else if (!isWall(board, currentPath)) {

    if (!characterHitsAnotherCharacter(character, currentPath, characters)) {
      if (steps <= 0) {
        if (!(isSpawn(board, currentPath) && !isOwnSpawn(currentPath, character))) {
          paths.push(currentPath);
        }

      } else {

        addToPath(currentPath);

        steps--;
        for (const direction of getDirections()) {
          paths.push(...tryMove(board, currentPath, direction, steps, character, characters));
        }
      }
    } else {
      const pacMan = ghostHitsPacMan(character, currentPath, characters);
      if (pacMan instanceof Character && !isCharactersSpawn(currentPath, pacMan)) {
        paths.push(currentPath);
      }
    }
  }
  return paths;
}

function isCharactersSpawn(currentPath: Path, character: Character): boolean {
  return character.SpawnPosition?.At.X === currentPath.End.X && character.SpawnPosition.At.Y === currentPath.End.Y;
}

/**
 * Checks if the current character is a ghost, and Pac-Man is on the same tile
 * @param character The current character
 * @param currentPath The current path the character is on
 * @param characters All the characters on the board
 * @returns True if the character is a ghost and hits Pac-Man
 */
function ghostHitsPacMan(character: Character, currentPath: Path, characters: Character[]): Character | undefined | false {
  return character.isGhost() && characters.find(c => c.isPacMan() && c.isAt(currentPath.End));
}

/**
 * Checks if the current character hits another character
 * @param character The current character
 * @param currentPath The current path the character is on
 * @param characters All the characters on the board
 * @returns True if the character hits another character
 */
function characterHitsAnotherCharacter(character: Character, currentPath: Path, characters: Character[]): boolean {
  return characters.find(c => c !== character && c.isAt(currentPath.End)) !== undefined;
}

/**
 * Adds the current position to the path, if it's not on the spawn and it's not already in the path
 * @param currentPos The current path the character is on
 */
function addToPath(currentPos: Path): void {
  if (!currentPos.Path) {
    currentPos.Path = [];
  } else if (!currentPos.Path.includes(currentPos.End)) {
    currentPos.Path = [...currentPos.Path, currentPos.End];
  }
}

/**
 * Tries to move the character in the given direction. The character can move in all directions except the one it came from.
 * Only Pac-Man characters can move through the teleportation tiles.
 * @param board The board the character is on
 * @param path The current path the character is on
 * @param direction The direction to move in
 * @param steps The number of steps the character can move
 * @param character The current character
 * @param characters
 * @returns An array of paths the character can move to
 */
function tryMove(board: GameMap, path: Path, direction: Direction, steps: number, character: Character, characters: Character[]): Path[] {

  function getNewPosition(): Position {
    switch (direction) {
      case Direction.left:
        return {
          X: path.End.X - 1,
          Y: path.End.Y
        };
      case Direction.up:
        return {
          X: path.End.X,
          Y: path.End.Y - 1
        };
      case Direction.right:
        return {
          X: path.End.X + 1,
          Y: path.End.Y
        };
      case Direction.down:
        return {
          X: path.End.X,
          Y: path.End.Y + 1
        };
    }
  }

  if (path.Direction !== (direction + 2) % 4) {
    // TODO getNewPosition() and check if a character is on the new position
    return findPossibleRecursive(board, {
      End: getNewPosition(), Direction: direction, Path: path.Path
    }, steps, character, characters);
  }
  return [];
}

/**
 * Finds all the possible paths when using teleportation tiles
 * @param board The board the character is on
 * @param currentPath The current path the character is on
 * @param steps The number of steps the character can move
 * @param character The current character
 * @param characters
 */
function addTeleportationTiles(board: GameMap, currentPath: Path, steps: number, character: Character, characters: Character[]): Path[] {
  const possiblePositions = findTeleportationTiles(board);
  const paths: Path[] = [];
  for (const pos of possiblePositions) {
    if (pos.End.X !== interval(0, board.length - 1, currentPath.End.X) ||
      pos.End.Y !== interval(0, board.length - 1, currentPath.End.Y)) {

      pos.Path = currentPath.Path;
      paths.push(...findPossibleRecursive(board, pos, steps, character, characters));
    }
  }
  return paths;
}

function interval(lower: number, upper: number, value: number): number {
  return Math.max(Math.min(value, upper), lower);
}

/**
 * Finds all the teleportation tiles on the board
 * @param board The board the character is on
 * @returns An array of paths containing the teleportation tiles
 */
function findTeleportationTiles(board: GameMap): Path[] {
  const possiblePositions: Path[] = [];
  const edge = [0, board.length - 1];

  for (const e of edge) {
    for (let i = 0; i < board[e].length; i++) {

      pushPath(board, possiblePositions, i, e);
      pushPath(board, possiblePositions, e, i);
    }
  }

  return possiblePositions;
}

/**
 * Pushes a path to the array if the position is not a wall
 * @param board The board the character is on
 * @param possiblePositions The array of paths to push to
 * @param x The x position of the path
 * @param y The y position of the path
 */
function pushPath(board: GameMap, possiblePositions: Path[], x: number, y: number): void {
  if (board[x][y] !== TileType.wall) {
    possiblePositions.push({End: {X: x, Y: y}, Direction: findDirection(x, y, board.length)});
  }
}

/**
 * Finds the direction the character will be facing when moving to the given position
 * @param x The x position of the new position
 * @param y The y position of the new position
 * @param boardSize The length of the board
 */
function findDirection(x: number, y: number, boardSize: number): Direction {
  let direction: Direction;
  if (x === 0) {
    direction = Direction.right;
  } else if (y === 0) {
    direction = Direction.down;
  } else if (x === boardSize - 1) {
    direction = Direction.left;
  } else {
    direction = Direction.up;
  }
  return direction;
}

/**
 * Checks if the character is outside the board
 * @param currentPos The current position of the character
 * @param boardSize The size of the board
 */
function isOutsideBoard(currentPos: Path, boardSize: number): boolean {
  const pos = currentPos.End;
  return pos.X < 0 || pos.X >= boardSize || pos.Y < 0 || pos.Y >= boardSize;
}

/**
 * Checks if the character is on a wall
 * @param board The board the character is on
 * @param currentPos The current position of the character
 */
function isWall(board: GameMap, currentPos: Path): boolean {
  const pos = currentPos.End;
  return board[pos.Y][pos.X] === TileType.wall; // Shouldn't work, but it does
}

/**
 * Checks if the character is on a spawn
 * @param board The board the character is on
 * @param currentPos The current position of the character
 */
function isSpawn(board: GameMap, currentPos: Path) {
  const pos = currentPos.End;
  return board[pos.Y][pos.X] === TileType.pacmanSpawn || board[pos.Y][pos.X] === TileType.ghostSpawn;
}

/**
 * Checks if the character is on its own spawn
 * @param currentPos The current position of the character
 * @param character The current character
 */
function isOwnSpawn(currentPos: Path, character: Character): boolean {
  const pos = currentPos.End;
  const charPos = character.SpawnPosition!.At;
  return charPos.X === pos.X && charPos.Y === pos.Y;
}

