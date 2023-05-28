import {TileType} from "./tileType";
import {Character, PacMan} from "./character";
import {Direction} from "./direction";

/**
 * Finds all the possible positions for the character to move to
 * @param board The board the character is on
 * @param character The current position of the character
 * @param steps The number of steps the character can move
 * @returns {Path[]} An array of paths the character can move to
 */
export default function findPossiblePositions(board: GameMap, character: Character, steps: number): Path[] {
  return findPossibleRecursive(board, character.position, steps, character instanceof PacMan);
}

/**
 * Uses recursion to move through the board and find all the possible positions
 * @param board The board the character is on
 * @param path The current path the character is on
 * @param steps The number of steps the character can move
 * @param isPacMan True if the character is Pac-Man, false if it is a ghost
 * @returns {Path[]} An array of paths the character can move to
 */
function findPossibleRecursive(board: GameMap, path: Path, steps: number, isPacMan: boolean): Path[] {

  const paths: Path[] = [];
  if (isOutsideBoard(path, board.length)) {
    if (isPacMan) {
      return addTeleportationTiles(board, path, steps, isPacMan);
    }
  } else if (!isWall(board, path)) {
    if (steps === 0) {
      paths.push(path);
    } else {

      steps--;
      paths.push(...tryMove(board, path, Direction.up, steps, isPacMan));
      paths.push(...tryMove(board, path, Direction.right, steps, isPacMan));
      paths.push(...tryMove(board, path, Direction.down, steps, isPacMan));
      paths.push(...tryMove(board, path, Direction.left, steps, isPacMan));
    }
  }
  return paths;
}

/**
 * Tries to move the character in the given direction
 * @param board The board the character is on
 * @param path The current path the character is on
 * @param direction The direction to move in
 * @param steps The number of steps the character can move
 * @param isPacMan True if the character is Pac-Man, false if it is a ghost
 * @returns {Path[]} An array of paths the character can move to
 */
function tryMove(board: GameMap, path: Path, direction: Direction, steps: number, isPacMan: boolean): Path[] {

  function getNewPosition(): Position {
    switch (direction) {
      case Direction.left:
        return {
          x: path.end.x - 1,
          y: path.end.y
        };
      case Direction.up:
        return {
          x: path.end.x,
          y: path.end.y - 1
        };
      case Direction.right:
        return {
          x: path.end.x + 1,
          y: path.end.y
        };
      case Direction.down:
        return {
          x: path.end.x,
          y: path.end.y + 1
        };
    }
  }

  if (path.direction !== (direction + 2) % 4) {
    return findPossibleRecursive(board, {
      end: getNewPosition(), direction: direction
    }, steps, isPacMan);
  }
  return [];
}

/**
 * Finds all the possible paths when using teleportation tiles
 * @param board The board the character is on
 * @param path The current path the character is on
 * @param steps The number of steps the character can move
 * @param isPacMan True if the character is Pac-Man, false if it is a ghost
 */
function addTeleportationTiles(board: GameMap, path: Path, steps: number, isPacMan: boolean): Path[] {
  const possiblePositions = findTeleportationTiles(board);
  const paths: Path[] = [];
  for (const pos of possiblePositions) {
    if (pos.end.x !== Math.max(path.end.x, 0) || pos.end.y !== Math.max(path.end.y, 0)) {
      paths.push(...findPossibleRecursive(board, pos, steps, isPacMan));
    }
  }
  return paths;
}

/**
 * Finds all the teleportation tiles on the board
 * @param board The board the character is on
 * @returns {Path[]} An array of paths containing the teleportation tiles
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
    possiblePositions.push({end: {x, y}, direction: findDirection(x, y, board.length)});
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
  const pos = currentPos.end;
  return pos.x < 0 || pos.x >= boardSize || pos.y < 0 || pos.y >= boardSize;
}

/**
 * Checks if the character is on a wall
 * @param board The board the character is on
 * @param currentPos The current position of the character
 */
function isWall(board: GameMap, currentPos: Path): boolean {
  const pos = currentPos.end;
  return board[pos.y][pos.x] === TileType.wall; // Shouldn't work, but it does
}

/**
 * Checks if the character is on a spawn
 * @param board The board the character is on
 * @param currentPos The current position of the character
 */
function isSpawn(board: GameMap, currentPos: Path): boolean { // TODO check if character is on it's own spawn
  const pos = currentPos.end;
  return board[pos.x][pos.y] === TileType.pacmanSpawn || board[pos.x][pos.y] === TileType.ghostSpawn;
}

