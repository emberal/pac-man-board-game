export enum Colour {
  white = "white",
  red = "red",
  blue = "blue",
  yellow = "yellow",
  green = "green",
  purple = "purple",
  grey = "grey",
}

export const getColours = (): Colour[] => Object.values(Colour);
