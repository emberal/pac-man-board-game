export default class Box implements BoxProps {
  public readonly colour;
  public pellets;
  public powerPellets;

  public constructor({colour, pellets = 0, powerPellets = 0}: BoxProps) {
    this.colour = colour;
    this.pellets = pellets;
    this.powerPellets = powerPellets;
  }

  public addPellet(): void {
    this.pellets++;
  }

  public removePellet(): boolean {
    if (this.pellets <= 0) return false;
    this.pellets--;
    return true;
  }

  public addPowerPellet(): void {
    this.powerPellets++;
  }

  public removePowerPellet(): boolean {
    if (this.powerPellets <= 0) return false;
    this.powerPellets--;
    return true;
  }

}
