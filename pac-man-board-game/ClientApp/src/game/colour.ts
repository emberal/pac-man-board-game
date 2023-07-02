export enum Colour {
  White = "white",
  Red = "red",
  Blue = "blue",
  Yellow = "yellow",
  Green = "green",
  Purple = "purple",
  Grey = "grey",
}

export const getColours = (): Colour[] => Object.values(Colour);
