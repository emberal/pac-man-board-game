import {TileType} from "./tileType";
import {Character, PacMan} from "./character";
import {Direction} from "./direction";

/**
 * Finds all the possible positions for the character to move to
 * @param board The board the character is on
 * @param character The current position of the character
 * @param steps The number of steps the character can move
 */
export default function findPossiblePositions(board: GameMap, character: Character, steps: number): Path[] {
  const possiblePositions: Path[] = [];
  findPossibleRecursive(board, character.position, steps, // TODO sometimes the character steps on the same tile twice
    character instanceof PacMan, possiblePositions);
  return possiblePositions;
}

function findPossibleRecursive(board: GameMap, currentPath: Path, steps: number,
                               isPacMan: boolean, possibleList: Path[]): void {

  if (isOutsideBoard(currentPath, board.length)) {
    if (!isPacMan) return;
    addTeleportationTiles(board, currentPath, steps, isPacMan, possibleList);
    return;
  } else if (isWall(board, currentPath)) {
    return;
  }

  if (steps === 0) {
    pushTileToList(board, currentPath, possibleList);
  } else {

    steps--;
    tryMove(board, currentPath, Direction.up, steps, isPacMan, possibleList);
    tryMove(board, currentPath, Direction.right, steps, isPacMan, possibleList);
    tryMove(board, currentPath, Direction.down, steps, isPacMan, possibleList);
    tryMove(board, currentPath, Direction.left, steps, isPacMan, possibleList);
  }
}

function tryMove(board: GameMap, currentPath: Path, direction: Direction, steps: number, isPacMan: boolean, possibleList: Path[]): void {

  function getNewPosition(): Position {
    switch (direction) {
      case Direction.left:
        return {
          x: currentPath.end.x - 1,
          y: currentPath.end.y
        };
      case Direction.up:
        return {
          x: currentPath.end.x,
          y: currentPath.end.y - 1
        };
      case Direction.right:
        return {
          x: currentPath.end.x + 1,
          y: currentPath.end.y
        };
      case Direction.down:
        return {
          x: currentPath.end.x,
          y: currentPath.end.y + 1
        };
    }
  }

  if (currentPath.direction !== (direction + 2) % 4) {
    findPossibleRecursive(board, {
      end: getNewPosition(), direction: direction
    }, steps, isPacMan, possibleList);
  }
}

function addTeleportationTiles(board: GameMap, currentPath: Path, steps: number, isPacMan: boolean,
                               possibleList: Path[]): void {
  const possiblePositions = findTeleportationTiles(board);
  for (const pos of possiblePositions) {
    if (pos.end.x !== Math.max(currentPath.end.x, 0) || pos.end.y !== Math.max(currentPath.end.y, 0)) {
      findPossibleRecursive(board, pos, steps, isPacMan, possibleList);
    }
  }
}

function pushTileToList(board: GameMap, tile: Path | null, list: Path[]): void {
  if (tile !== null && !list.find(p => p.end.x === tile.end.x && p.end.y === tile.end.y) &&
    !isOutsideBoard(tile, board.length) && !isSpawn(board, tile)) {
    list.push(tile);
  }
}

function findTeleportationTiles(board: number[][]): Path[] {
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

function pushPath(board: GameMap, possiblePositions: Path[], x: number, y: number): void {
  if (board[x][y] !== TileType.wall) {
    possiblePositions.push({end: {x, y}, direction: findDirection(x, y, board.length)});
  }
}

function findDirection(x: number, y: number, length: number): Direction {
  let direction: Direction;
  if (x === 0) {
    direction = Direction.right;
  } else if (y === 0) {
    direction = Direction.down;
  } else if (x === length - 1) {
    direction = Direction.left;
  } else {
    direction = Direction.up;
  }
  return direction;
}

function isOutsideBoard(currentPos: Path, boardSize: number): boolean {
  const pos = currentPos.end;
  return pos.x < 0 || pos.x >= boardSize || pos.y < 0 || pos.y >= boardSize;
}

function isWall(board: GameMap, currentPos: Path): boolean {
  const pos = currentPos.end;
  return board[pos.y][pos.x] === TileType.wall; // Shouldn't work, but it does
}

function isSpawn(board: GameMap, currentPos: Path): boolean {
  const pos = currentPos.end;
  return board[pos.x][pos.y] === TileType.pacmanSpawn || board[pos.x][pos.y] === TileType.ghostSpawn;
}

