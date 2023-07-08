import Pellet from "./pellet";
import {Colour} from "./colour";

export default class Box {
  public Pellets: Pellet[];
  public readonly Colour: Colour;

  public constructor({Colour, Pellets = []}: BoxProps) {
    this.Colour = Colour;
    this.Pellets = Pellets;
  }

  get powerPellet(): Pellet | undefined {
    return this.Pellets.find(pellet => pellet.isPowerPellet);
  }

  get count(): number {
    return this.Pellets.filter(pellet => !pellet.isPowerPellet).length;
  }

  get countPowerPellets(): number {
    return this.Pellets.filter(pellet => pellet.isPowerPellet).length;
  }

  public addPellet(pellet: Pellet): void {
    this.Pellets.push(pellet);
  }

}
