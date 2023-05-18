import WebSocketService from "../classes/WebSocketService";

export default class Game {

  private wsService: WebSocketService;

  constructor() {
    this.wsService = new WebSocketService("wss://localhost:3000/api/game");
    // Connect to the server

    // Create players

    // Pick player pieces

    // Roll to start
  }

  public gameLoop(setDice: Setter<number[]>): void {
    // Throw the dices
    this.rollDice().then((dices) => {
      console.log(dices);
      setDice(dices);
    });

    // Choose a dice and move pac-man or a ghost

    // Use the remaining dice to move pac-man if the player moved a ghost or vice versa

    // Check if the game is over

    // If not, next player
  }

  public connectToServer(): void {
    this.wsService.open();
    this.wsService.registerEvents();
  }

  public isConnected(): boolean {
    return this.wsService.isOpen();
  }

  private createPlayers(): void {
    throw new Error("Not implemented");
  }

  private pickPlayerPieces(): void {
    throw new Error("Not implemented");
  }

  private rollToStart(): void {
    throw new Error("Not implemented");
  }

  private async rollDice(): Promise<number[]> {
    let result: number[];
    result = await this.wsService.sendAndReceive<number[]>("roll");
    return result;
  }

  private chooseDice(dices: number[]): number {
    throw new Error("Not implemented");
  }

  private movePacMan(dice: number): void {
    throw new Error("Not implemented");
  }

  private moveGhost(dice: number): void {
    throw new Error("Not implemented");
  }

  private isGameOver(): boolean {
    throw new Error("Not implemented");
  }

  private nextPlayer(): void {
    throw new Error("Not implemented");
  }

}