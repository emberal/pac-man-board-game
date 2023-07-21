import {TileType} from "./tileType";
import {Character} from "./character";
import {Direction, getDirections} from "./direction";

// TODO if a Pac-Man with a powerpellet hits a ghost, the Pac-Man can't walk further

/**
 * Finds all the possible positions for the character to move to
 * @param board The board the character is on
 * @param character The current position of the character
 * @param steps The number of steps the character can move
 * @param characters All the characters on the map
 * @returns An array of paths the character can move to
 */
export default function findPossiblePositions(board: GameMap, character: Character, steps: number, characters: Character[]): Path[] {
  if (!character.position || !character.spawnPosition) throw new Error("Character has no position or spawn position");
  return findPossibleRecursive(board, character.position, steps, character, characters);
};

/**
 * Uses recursion to move through the map and find all the possible positions
 * @param map The map the character is on
 * @param currentPath The current path the character is on
 * @param steps The number of steps the character can move
 * @param character The current character
 * @param characters All the characters on the map
 * @returns An array of paths the character can move to
 */
function findPossibleRecursive(map: GameMap, currentPath: Path, steps: number, character: Character, characters: Character[]): Path[] {

  const paths: Path[] = [];
  if (isOutsideBoard(currentPath, map.length)) {
    if (character.isPacMan()) {
      return addTeleportationTiles(map, currentPath, steps, character, characters);
    }
  } else if (!isWall(map, currentPath)) {

    if (!characterHitsAnotherCharacter(character, currentPath, characters)) {
      if (steps <= 0) {
        if (!(isSpawn(map, currentPath) && !isOwnSpawn(currentPath, character))) {
          paths.push(currentPath);
        }

      } else {

        tryAddToPath(currentPath);

        steps--;
        for (const direction of getDirections()) {
          paths.push(...tryMove(map, currentPath, direction, steps, character, characters));
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

/**
 * Checks if the current character is on its spawn
 * @param currentPath The current path the character is on
 * @param character The current character
 * @returns True if the character is on its spawn, otherwise false
 */
function isCharactersSpawn(currentPath: Path, character: Character): boolean {
  return character.spawnPosition?.at.x === currentPath.end.x && character.spawnPosition.at.y === currentPath.end.y;
}

/**
 * Checks if the current character is a ghost, and Pac-Man is on the same tile
 * @param character The current character
 * @param currentPath The current path the character is on
 * @param characters All the characters on the board
 * @returns True if the character is a ghost and hits Pac-Man, otherwise false
 */
function ghostHitsPacMan(character: Character, currentPath: Path, characters: Character[]): Character | undefined | false {
  return character.isGhost() && characters.find(c => c.isPacMan() && c.isAt(currentPath.end));
}

/**
 * Checks if the current character hits another character
 * @param character The current character
 * @param currentPath The current path the character is on
 * @param characters All the characters on the board
 * @returns True if the character hits another character, otherwise false
 */
function characterHitsAnotherCharacter(character: Character, currentPath: Path, characters: Character[]): boolean {
  return characters.find(c => c !== character && c.isAt(currentPath.end)) !== undefined;
}

/**
 * Adds the current position to the path, if it's not on the spawn and it's not already in the path
 * @param currentPos The current path the character is on
 */
function tryAddToPath(currentPos: Path): void {
  if (!currentPos.path) {
    currentPos.path = [];
  } else if (!currentPos.path.includes(currentPos.end)) {
    currentPos.path = [...currentPos.path, currentPos.end];
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
 * @param characters All the characters on the board
 * @returns An array of paths the character can move to
 */
function tryMove(board: GameMap, path: Path, direction: Direction, steps: number, character: Character, characters: Character[]): Path[] {

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
    // TODO getNewPosition() and check if a character is on the new position
    return findPossibleRecursive(board, {
      end: getNewPosition(), direction: direction, path: path.path
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
 * @param characters All the characters on the map
 */
function addTeleportationTiles(board: GameMap, currentPath: Path, steps: number, character: Character, characters: Character[]): Path[] {
  const possiblePositions = findTeleportationTiles(board);
  const paths: Path[] = [];
  for (const pos of possiblePositions) {
    if (pos.end.x !== interval(0, board.length - 1, currentPath.end.x) ||
      pos.end.y !== interval(0, board.length - 1, currentPath.end.y)) {

      pos.path = currentPath.path;
      paths.push(...findPossibleRecursive(board, pos, steps, character, characters));
    }
  }
  return paths;
}

/**
 * Checks if the value is between the lower and upper bounds
 * @param lower The lower bound
 * @param upper The upper bound
 * @param value The value to check
 * @returns The value if it's between the lower and upper bounds, otherwise it returns the lower or upper bound
 */
function interval(lower: number, upper: number, value: number): number {
  return Math.max(Math.min(value, upper), lower);
}

/**
 * Finds all the teleportation tiles on the map
 * @param map The map the character is on
 * @returns An array of paths containing the teleportation tiles
 */
function findTeleportationTiles(map: GameMap): Path[] {
  const possiblePositions: Path[] = [];
  const edge = [0, map.length - 1];

  for (const e of edge) {
    for (let i = 0; i < map[e].length; i++) {

      pushPath(map, possiblePositions, i, e);
      pushPath(map, possiblePositions, e, i);
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
  if (board[y] && board[y][x] !== TileType.wall) {
    possiblePositions.push({end: {x: x, y: y}, direction: findDirection(x, y, board.length)});
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
function isSpawn(board: GameMap, currentPos: Path) {
  const pos = currentPos.end;
  return board[pos.y][pos.x] === TileType.pacmanSpawn || board[pos.y][pos.x] === TileType.ghostSpawn;
}

/**
 * Checks if the character is on its own spawn
 * @param currentPos The current position of the character
 * @param character The current character
 */
function isOwnSpawn(currentPos: Path, character: Character): boolean {
  const pos = currentPos.end;
  const charPos = character.spawnPosition!.at;
  return charPos.x === pos.x && charPos.y === pos.y;
}

