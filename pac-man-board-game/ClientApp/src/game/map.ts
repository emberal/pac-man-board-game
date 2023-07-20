import {CharacterType} from "./character";
import {Direction} from "./direction";

/**
 * 0 = empty
 * 1 = wall
 * 2 = pellet
 * 3 = power pellet
 * 4 = ghost spawn
 * 5 = pacman spawn
 */
export const testMap: GameMap = [ // TODO create map class object using tile type enum
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 5, 1, 0, 1, 4, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 4, 1, 0, 1, 5, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
];

export function getCharacterSpawns(map: GameMap): { type: CharacterType, position: DirectionalPosition }[] {

  const result: { type: CharacterType, position: DirectionalPosition }[] = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map.length; col++) {
      // TODO find direction
      if (map[row][col] === 4) {
        result.push({type: CharacterType.ghost, position: {At: {X: col, Y: row}, Direction: Direction.up}});
      } else if (map[row][col] === 5) {
        result.push({
          type: CharacterType.pacMan, position: {At: {X: col, Y: row}, Direction: Direction.up}
        });
      }
    }
  }

  return result;
}

export function getPacManSpawns(map: GameMap): DirectionalPosition[] {
  return getCharacterSpawns(map)
    .filter(s => s.type === CharacterType.pacMan)
    .map(s => s.position)
}