import {Character, Ghost, PacMan} from "./character";

export default class TileMap {

  /**
   * 0 = empty
   * 1 = wall
   * 2 = pellet
   * 3 = power pellet
   * 4 = ghost spawn
   * 5 = pacman spawn
   */
  private map: number[][] = [
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

  public characters: Character[] = [];

  public constructor() {
    this.characters.push(new PacMan("yellow", {x: 3, y: 3}), new Ghost("blue", {x: 7, y: 3}));
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.drawMap(ctx);
    this.drawCharacters(ctx);
  }

  private drawMap(context: CanvasRenderingContext2D): void {
    const tileSize = this.getTileSize(context);

    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {

        const tile = this.map[row][col];
        switch (tile) {
          case 0:
            this.drawTile(context, col * tileSize, row * tileSize, tileSize, "black");
            break;
          case 1:
            this.drawTile(context, col * tileSize, row * tileSize, tileSize, "blue");
            break;
          case 2:
            this.drawTile(context, col * tileSize, row * tileSize, tileSize, "yellow");
            break;
          case 3:
            this.drawTile(context, col * tileSize, row * tileSize, tileSize, "orange");
            break;
          case 4:
            this.drawTile(context, col * tileSize, row * tileSize, tileSize, "red");
            break;
        }

      }
    }
  }

  private drawTile(context: CanvasRenderingContext2D, x: number, y: number, tileSize: number, color: string): void {
    context.fillStyle = color;
    context.fillRect(x, y, tileSize, tileSize);
  }

  private drawCharacters(ctx: CanvasRenderingContext2D): void {
    for (const character of this.characters) {
      this.drawCircle(ctx, character);
    }
  }

  private drawCircle(ctx: CanvasRenderingContext2D, character: Character): void {
    const tileSize = this.getTileSize(ctx);
    const x = character.position.x * tileSize;
    const y = character.position.y * tileSize;
    ctx.fillStyle = character.color;
    ctx.beginPath();
    ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 2, tileSize / 2, 0.34 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  private getTileSize(context: CanvasRenderingContext2D): number {
    const canvasSize = context.canvas.width;
    return canvasSize / this.map[0].length;
  }
}
