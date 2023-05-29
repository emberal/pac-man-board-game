import {NormalPellet, Pellet, PowerPellet} from "./pellet";

export default class Box {
  private pellets: Pellet[] = [];
  public readonly colour: Colour;

  public constructor(colour: Colour, pellets: Pellet[] = []) {
    this.colour = colour;
    this.pellets = pellets;
  }

  public addPellet(pellet: Pellet): void {
    this.pellets.push(pellet);
  }

  get powerPellet(): Pellet | undefined {
    return this.pellets.find(pellet => pellet instanceof PowerPellet);
  }

  get count(): number {
    return this.pellets.filter(pellet => pellet instanceof NormalPellet).length;
  }
  
  get countPowerPellets(): number {
    return this.pellets.filter(pellet => pellet instanceof PowerPellet).length;
  }
  
}
