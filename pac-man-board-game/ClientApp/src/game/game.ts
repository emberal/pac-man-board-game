export default class Game {

  constructor() {
    // Connect to the server

    // Create players

    // Pick player pieces

    // Roll to start
  }

  public gameLoop(): void {
    // Throw the dices

    // Choose a dice and move pac-man or a ghost

    // Use the remaining dice to move pac-man if the player moved a ghost or vice versa

    // Check if the game is over

    // If not, next player
  }

  private connectToServer(): void {
    throw new Error("Not implemented");
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

  private throwDices(): number[] {
    throw new Error("Not implemented");
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