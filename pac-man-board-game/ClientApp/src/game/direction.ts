export enum Direction {
  left,
  up,
  right,
  down
}

export const getDirections = () => Object.values(Direction)
  .filter(d => !isNaN(Number(d))) as Direction[];
