import {TileType} from "../components/gameBoard";

/**
 * Finds all the possible positions for the character to move to
 * @param board The board the character is on
 * @param currentPos The current position of the character
 * @param steps The number of steps the character can move
 */
export function findPossiblePositions(board: number[][], currentPos: CharacterPosition, steps: number): CharacterPosition[] {
  const possiblePositions: CharacterPosition[] = [];
  findPossibleRecursive(board, currentPos, steps, possiblePositions);
  return possiblePositions;
}

// TODO character phasing through wall next to spawn
function findPossibleRecursive(board: number[][], currentPos: CharacterPosition, steps: number,
                               possibleList: CharacterPosition[]): CharacterPosition | null {
  if (isWall(board, currentPos)) return null;
  // TODO handle teleportation
  if (steps === 0) return currentPos;

  const result = {
    up: findPossibleRecursive(board, {x: currentPos.x, y: currentPos.y + 1}, steps - 1, possibleList),
    right: findPossibleRecursive(board, {x: currentPos.x + 1, y: currentPos.y}, steps - 1, possibleList),
    down: findPossibleRecursive(board, {x: currentPos.x, y: currentPos.y - 1}, steps - 1, possibleList),
    left: findPossibleRecursive(board, {x: currentPos.x - 1, y: currentPos.y}, steps - 1, possibleList),
  };

  for (const [_, value] of Object.entries(result)) {
    if (value !== null && !possibleList.find(p => p.x === value.x && p.y === value.y) && !isSpawn(board, value)) {
      possibleList.push(value);
    }
  }

  return null;
}

function isWall(board: number[][], currentPos: CharacterPosition): boolean {
  return board[currentPos.x][currentPos.y] === TileType.wall;
}

function isSpawn(board: number[][], currentPos: CharacterPosition): boolean {
  return board[currentPos.x][currentPos.y] === TileType.pacmanSpawn ||
    board[currentPos.x][currentPos.y] === TileType.ghostSpawn;
}

