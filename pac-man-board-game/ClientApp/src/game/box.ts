import Pellet from "./pellet";

export interface BoxProps {
  pellets?: Pellet[],
  readonly colour: Colour,
}

export default class Box {
  public pellets: Pellet[];
  public readonly colour: Colour;

  public constructor({colour, pellets = []}: BoxProps) {
    this.colour = colour;
    this.pellets = pellets;
  }

  public addPellet(pellet: Pellet): void {
    this.pellets.push(pellet);
  }

  get powerPellet(): Pellet | undefined {
    return this.pellets.find(pellet => pellet.isPowerPellet);
  }

  get count(): number {
    return this.pellets.filter(pellet => !pellet.isPowerPellet).length;
  }

  get countPowerPellets(): number {
    return this.pellets.filter(pellet => pellet.isPowerPellet).length;
  }

}
