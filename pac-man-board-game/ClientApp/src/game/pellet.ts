export abstract class Pellet {
  public readonly colour: Colour;

  protected constructor(colour: Colour) {
    this.colour = colour;
  }

}

export class NormalPellet extends Pellet {
  public constructor() {
    super("white");
  }
}

export class PowerPellet extends Pellet {
  public constructor() {
    super("yellow");
  }
}
