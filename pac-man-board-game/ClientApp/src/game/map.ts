/**
 * 0 = empty
 * 1 = wall
 * 2 = pellet
 * 3 = power pellet
 * 4 = ghost spawn
 * 5 = pacman spawn
 */
export const testMap: GameMap = [
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 5, 1, 0, 1, 4, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [0, 2, 0, 0, 0, 3, 0, 0, 0, 2, 0],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 4, 1, 0, 1, 5, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
];