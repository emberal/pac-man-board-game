import {TileType} from "./tileType";

/**
 * Finds all the possible positions for the character to move to
 * @param board The board the character is on
 * @param currentPos The current position of the character
 * @param steps The number of steps the character can move
 */
export default function findPossiblePositions(board: number[][], currentPos: CharacterPosition, steps: number): CharacterPosition[] {
  const possiblePositions: CharacterPosition[] = [];
  findPossibleRecursive(board, currentPos, steps, possiblePositions, []);
  return possiblePositions;
}

function findPossibleRecursive(board: number[][], currentPos: CharacterPosition, steps: number,
                               possibleList: CharacterPosition[], visitedTiles: CharacterPosition[]): CharacterPosition | null {
  if (isOutsideBoard(currentPos, board.length)) {
    addTeleportationTiles(board, currentPos, steps, possibleList, visitedTiles);
  } else if (visitedTiles.find(tile => tile.x === currentPos.x && tile.y === currentPos.y)) {
    return null;
  } else if (isWall(board, currentPos)) {
    return null;
  }
  visitedTiles.push(currentPos);
  if (steps === 0) return currentPos;

  const nextStep = steps - 1;
  const result = {
    up: findPossibleRecursive(board, {x: currentPos.x, y: currentPos.y + 1}, nextStep, possibleList, visitedTiles),
    right: findPossibleRecursive(board, {x: currentPos.x + 1, y: currentPos.y}, nextStep, possibleList, visitedTiles),
    down: findPossibleRecursive(board, {x: currentPos.x, y: currentPos.y - 1}, nextStep, possibleList, visitedTiles),
    left: findPossibleRecursive(board, {x: currentPos.x - 1, y: currentPos.y}, nextStep, possibleList, visitedTiles),
  };

  pushToList(board, possibleList, Object.values(result));
  return null;
}

function addTeleportationTiles(board: number[][], currentPos: CharacterPosition, steps: number,
                               possibleList: CharacterPosition[], visitedTiles: CharacterPosition[]): void {
  const newPositons: (CharacterPosition | null)[] = [];
  const possiblePositions = findTeleportationTiles(board);
  for (const pos of possiblePositions) {
    if (pos.x !== Math.max(currentPos.x, 0) || pos.y !== Math.max(currentPos.y, 0)) {
      newPositons.push(findPossibleRecursive(board, pos, steps, possibleList, visitedTiles));
    }
  }
  pushToList(board, possibleList, newPositons);
}

function pushToList(board: number[][], list: CharacterPosition[], newEntries: (CharacterPosition | null)[]): void {
  for (const entry of newEntries) {
    if (entry !== null && !list.find(p => p.x === entry.x && p.y === entry.y) && !isOutsideBoard(entry, board.length) && !isSpawn(board, entry)) {
      list.push(entry);
    }
  }
}

function findTeleportationTiles(board: number[][]): CharacterPosition[] {
  const possiblePositions: CharacterPosition[] = [];
  const edge = [0, board.length - 1];

  for (const e of edge) {
    for (let i = 0; i < board[e].length; i++) {

      if (board[e][i] !== TileType.wall) {
        possiblePositions.push({x: i, y: e});
      }
      if (board[i][e] !== TileType.wall) {
        possiblePositions.push({x: e, y: i});
      }
    }
  }

  return possiblePositions;
}

function isOutsideBoard(currentPos: CharacterPosition, boardSize: number): boolean {
  return currentPos.x < 0 || currentPos.x >= boardSize || currentPos.y < 0 || currentPos.y >= boardSize;
}

function isWall(board: number[][], currentPos: CharacterPosition): boolean {
  return board[currentPos.y][currentPos.x] === TileType.wall; // TODO shouldn't work, but it does
}

function isSpawn(board: number[][], currentPos: CharacterPosition): boolean {
  return board[currentPos.x][currentPos.y] === TileType.pacmanSpawn ||
    board[currentPos.x][currentPos.y] === TileType.ghostSpawn;
}

