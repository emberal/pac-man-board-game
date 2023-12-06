using System.Net.WebSockets;
using System.Text.Json;
using pacMan.DTOs;
using pacMan.Exceptions;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public interface IActionService
{
    Player Player { set; }
    Game? Game { get; set; }
    WebSocket WebSocket { set; }
    List<int> RollDice();
    List<Player> FindGame(JsonElement? jsonElement);
    MovePlayerData HandleMoveCharacter(JsonElement? jsonElement);
    ReadyData Ready();
    string FindNextPlayer();
    List<Player> LeaveGame();
    void SendToAll(ArraySegment<byte> segment);
    List<Player>? Disconnect();
}

/// <summary>
///     Provides various actions that can be performed in a game
/// </summary>
public class ActionService(ILogger logger, IGameService gameService) : IActionService
{
    public WebSocket WebSocket { private get; set; } = null!;

    public Game? Game { get; set; }

    public Player? Player { get; set; }

    /// <summary>
    ///     Rolls the dice and returns the result. If the game is null, an empty list is returned.
    /// </summary>
    /// <returns>A list of integers representing the values rolled on the dice.</returns>
    public List<int> RollDice()
    {
        Game?.DiceCup.Roll();
        var rolls = Game?.DiceCup.Values ?? [];
        logger.LogInformation("Rolled [{}]", string.Join(", ", rolls));

        return rolls;
    }

    /// <summary>
    ///     Handles the movement of the character based on the provided JSON element.
    /// </summary>
    /// <param name="jsonElement">The JSON element containing the data to move the character.</param>
    /// <returns>The MovePlayerData object representing the updated character movement information.</returns>
    public MovePlayerData HandleMoveCharacter(JsonElement? jsonElement)
    {
        var data = jsonElement?.Deserialize<MovePlayerData>() ?? throw new NullReferenceException("Data is null");
        if (Game is not null)
        {
            Game.Ghosts = data.Ghosts;
            Game.Players = data.Players;
        }

        return data;
    }

    /// <summary>
    ///     Finds a game based on the given JSON element.
    /// </summary>
    /// <param name="jsonElement">The JSON data containing the username and gameId.</param>
    /// <returns>The list of players in the found game.</returns>
    /// <exception cref="NullReferenceException">Thrown when the JSON data is null.</exception>
    /// <exception cref="GameNotFoundException">Thrown when the game with the given gameId does not exist.</exception>
    /// <exception cref="PlayerNotFoundException">Thrown when the player with the given username is not found in the game.</exception>
    public List<Player> FindGame(JsonElement? jsonElement)
    {
        var (username, gameId) =
            jsonElement?.Deserialize<JoinGameData>() ?? throw new NullReferenceException("Data is null");

        var game = gameService.FindGameById(gameId) ??
                   throw new GameNotFoundException($"Game was not found, id \"{gameId}\" does not exist");

        var player = game.FindPlayerByUsername(username) ??
                     throw new PlayerNotFoundException($"Player \"{username}\" was not found in game");

        player.State = game.IsGameStarted ? State.InGame : State.WaitingForPlayers; // TODO doesn't work anymore
        Player = player;
        Game = game;
        // TODO send missing data: Dices, CurrentPlayer, Ghosts | Return Game instead?
        Game.Connections += SendSegment;
        return Game.Players;
    }

    /// <summary>
    ///     Prepares the game and returns relevant data.
    /// </summary>
    /// <exception cref="PlayerNotFoundException">Thrown when the player is not found.</exception>
    /// <exception cref="GameNotFoundException">Thrown when the game is not found.</exception>
    /// <returns>A <see cref="ReadyData" /> object containing information about game readiness.</returns>
    public ReadyData Ready()
    {
        if (Player is null)
            throw new PlayerNotFoundException("Player not found, please create a new player");
        if (Game is null)
            throw new GameNotFoundException();

        var players = Game.SetReady(Player.Username).ToArray();
        // TODO roll to start
        Game.Shuffle();
        var allReady = players.All(p => p.State == State.Ready);
        if (allReady) Game.SetAllInGame();
        return new ReadyData { AllReady = allReady, Players = players };
    }

    /// <summary>
    ///     Finds the next player in the game.
    /// </summary>
    /// <returns>
    ///     The username of the next player in the game, if available.
    /// </returns>
    /// <exception cref="GameNotFoundException">
    ///     Thrown if the game is not found.
    /// </exception>
    public string FindNextPlayer() => Game?.NextPlayer().Username ?? throw new GameNotFoundException();

    /// <summary>
    ///     Removes the player from the game.
    /// </summary>
    /// <exception cref="NullReferenceException">Throws if the game or player is null.</exception>
    /// <returns>A list of remaining players in the game.</returns>
    public List<Player> LeaveGame()
    {
        if (Game is null) throw new NullReferenceException("Game is null");
        if (Player is null) throw new NullReferenceException("Player is null");
        Game.RemovePlayer(Player.Username);
        return Game.Players;
    }

    /// <summary>
    ///     Disconnects the player from the game.
    /// </summary>
    /// <returns>
    ///     Returns the list of players in the game after disconnecting the player.
    ///     Returns null if the player is already disconnected or is not connected to a game.
    /// </returns>
    public List<Player>? Disconnect()
    {
        if (Player is null) return null;
        Player.State = State.Disconnected;
        if (Game is not null) Game.Connections -= SendSegment;
        return Game?.Players;
    }

    /// <summary>
    ///     Sends a given byte segment to all players in the game.
    /// </summary>
    /// <param name="segment">The byte segment to send.</param>
    public void SendToAll(ArraySegment<byte> segment) => Game?.SendToAll(segment);

    /// <summary>
    ///     Sends an array segment of bytes through the WebSocket connection.
    /// </summary>
    /// <param name="segment">The array segment of bytes to send.</param>
    /// <returns>A task that represents the asynchronous send operation.</returns>
    private Task SendSegment(ArraySegment<byte> segment) => gameService.Send(WebSocket, segment);
}
