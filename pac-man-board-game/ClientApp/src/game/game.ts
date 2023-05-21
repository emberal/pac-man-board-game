import WebSocketService from "../websockets/WebSocketService";
import {Action} from "../websockets/actions";

export default class Game {

  private readonly _wsService: WebSocketService;
  public selectedDice?: SelectedDice;

  constructor() {
    this._wsService = new WebSocketService("wss://localhost:3000/api/game");
    // Connect to the server

    // Create players

    // Pick player pieces

    // Roll to start
  }

  public async gameLoop(setDice: Setter<number[] | undefined>): Promise<void> {
    // Throw the dice
    const result = await this.rollDice();
    const dice = result.Data;
    setDice(dice); // Updates the state of the current player

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

  public disconnect(): void {
    this._wsService.close();
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

  private async rollDice(): Promise<ActionMessage<number[]>> {
    let result: ActionMessage<number[]>;
    result = await this._wsService.sendAndReceive<ActionMessage<number[]>>({Action: Action.rollDice});
    return result;
  }

  private isGameOver(): boolean {
    throw new Error("Not implemented");
  }

  private nextPlayer(): void {
    throw new Error("Not implemented");
  }

  private chooseCharacter(): void {
    throw new Error("Method not implemented.");
  }

  get wsService(): WebSocketService {
    return this._wsService;
  }
}