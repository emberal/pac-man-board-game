import {TileType} from "./tileType";
import {Character, PacMan} from "./character";

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
                               isPacMan: boolean, possibleList: Path[]): Path | null {

  if (isOutsideBoard(currentPath, board.length)) {
    if (!isPacMan) return null;
    addTeleportationTiles(board, currentPath, steps, isPacMan, possibleList);
  } else if (isWall(board, currentPath)) {
    return null;
  }
  if (steps === 0) return currentPath;

  steps--;
  const possibleTiles: (Path | null)[] = [];

  if (currentPath.direction !== "down") {
    const up = findPossibleRecursive(board, {
      end: {
        x: currentPath.end.x,
        y: currentPath.end.y - 1,
      }, direction: "up"
    }, steps, isPacMan, possibleList);
    possibleTiles.push(up);
  }

  if (currentPath.direction !== "left") {
    const right = findPossibleRecursive(board, {
      end: {
        x: currentPath.end.x + 1,
        y: currentPath.end.y
      }, direction: "right"
    }, steps, isPacMan, possibleList);
    possibleTiles.push(right);
  }

  if (currentPath.direction !== "up") {
    const down = findPossibleRecursive(board, {
      end: {
        x: currentPath.end.x,
        y: currentPath.end.y + 1
      }, direction: "down"
    }, steps, isPacMan, possibleList);
    possibleTiles.push(down);
  }

  if (currentPath.direction !== "right") {
    const left = findPossibleRecursive(board, {
      end: {
        x: currentPath.end.x - 1,
        y: currentPath.end.y
      }, direction: "left"
    }, steps, isPacMan, possibleList);
    possibleTiles.push(left);
  }

  pushToList(board, possibleList, possibleTiles);
  return null;
}

function addTeleportationTiles(board: number[][], currentPath: Path, steps: number, isPacMan: boolean,
                               possibleList: Path[]): void {
  const newPositons: (Path | null)[] = [];
  const possiblePositions = findTeleportationTiles(board);
  for (const pos of possiblePositions) {
    if (pos.end.x !== Math.max(currentPath.end.x, 0) || pos.end.y !== Math.max(currentPath.end.y, 0)) {
      newPositons.push(findPossibleRecursive(board, pos, steps, isPacMan, possibleList));
    }
  }
  pushToList(board, possibleList, newPositons);
}

function pushToList(board: number[][], list: Path[], newEntries: (Path | null)[]): void {
  for (const entry of newEntries) {
    if (entry !== null && !list.find(p => p.end.x === entry.end.x && p.end.y === entry.end.y) &&
      !isOutsideBoard(entry, board.length) && !isSpawn(board, entry)) {
      list.push(entry);
    }
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

function pushPath(board: GameMap, possiblePositions: Path[], x: number, y: number) {
  if (board[x][y] !== TileType.wall) {
    possiblePositions.push({end: {x, y}, direction: findDirection(x, y, board.length)});
  }
}

function findDirection(x: number, y: number, length: number): Direction {
  let direction: Direction;
  if (x === 0) {
    direction = "right";
  } else if (y === 0) {
    direction = "down";
  } else if (x === length - 1) {
    direction = "left";
  } else {
    direction = "up";
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

