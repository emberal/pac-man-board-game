import Pellet from "./pellet";
import {Colour} from "./colour";

export default class Box {
  public pellets: Pellet[];
  public readonly colour: Colour;

  public constructor({colour, pellets = []}: BoxProps) {
    this.colour = colour;
    this.pellets = pellets;
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

  public addPellet(pellet: Pellet): void {
    this.pellets.push(pellet);
  }

}
