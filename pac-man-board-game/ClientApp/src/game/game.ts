import WebSocketService from "../classes/WebSocketService";
import {Action} from "../classes/actions";

export default class Game {

  private _wsService: WebSocketService;

  constructor() {
    this._wsService = new WebSocketService("wss://localhost:3000/api/game");
    // Connect to the server

    // Create players

    // Pick player pieces

    // Roll to start
  }

  public async gameLoop(setDice: Setter<number[] | undefined>): Promise<void> {
    // Throw the dices
    const result = await this.rollDice();
    setDice(result);

    // Choose a dice and move pac-man or a ghost

    // Use the remaining dice to move pac-man if the player moved a ghost or vice versa

    // Check if the game is over

    // If not, next player
  }

  public connectToServer(): void {
    this._wsService.open();
    this._wsService.registerEvents();
  }

  public isConnected(): boolean {
    return this._wsService.isOpen();
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
    result = await this._wsService.sendAndReceive<number[]>({action: Action.rollDice});
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

  get wsService(): WebSocketService {
    return this._wsService;
  }

}