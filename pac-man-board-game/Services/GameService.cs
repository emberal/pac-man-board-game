using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public interface IGameService : IWebSocketService
{
    SynchronizedCollection<Game> Games { get; }
    Game JoinById(Guid id, Player player);
    Game CreateAndJoin(Player player, Queue<DirectionalPosition> spawns);
    Game? FindGameById(Guid id);
    Game? FindGameByUsername(string username);
}

/// <summary>
///     The GameService class provides functionality for managing games in a WebSocket environment. It inherits from the
///     WebSocketService class.
/// </summary>
public class GameService(ILogger<WebSocketService> logger) : WebSocketService(logger), IGameService
{
    /// <summary>
    ///     A thread-safe collection (SynchronizedCollection) of "Game" objects. Utilized for managing multiple game instances
    ///     simultaneously.
    ///     It represents all the current games being managed by GameService.
    /// </summary>
    public SynchronizedCollection<Game> Games { get; } = [];

    /// <summary>
    ///     This method tries to find a game with the specified id, add a player to it and return the updated game.
    /// </summary>
    /// <param name="id">The unique id of the game the player wants to join</param>
    /// <param name="player">The player instance that wants to join the game</param>
    /// <returns>Returns the updated Game object after adding the player.</returns>
    /// <exception cref="GameNotFoundException">Thrown if a game with the specified id cannot be found.</exception>
    public Game JoinById(Guid id, Player player)
    {
        var game = Games.FirstOrDefault(g => g.Id == id) ?? throw new GameNotFoundException();
        game.AddPlayer(player);

        return game;
    }


    /// <summary>
    ///     Creates a new game and adds a player to it.
    /// </summary>
    /// <param name="player">The player instance that is going to join the new game.</param>
    /// <param name="spawns">A collection of spawn points arranged in a directional queue.</param>
    /// <returns>Returns the newly created Game object, with the player added to it.</returns>
    /// <exception cref="ArgumentException">
    ///     Thrown if the number of spawns is not equal to the maximum number of players set by
    ///     the Rules.
    /// </exception>
    public Game CreateAndJoin(Player player, Queue<DirectionalPosition> spawns)
    {
        if (spawns.Count != Rules.MaxPlayers)
            throw new ArgumentException($"The number of spawns must be equal to {Rules.MaxPlayers}.");

        var game = new Game(spawns);
        game.AddPlayer(player);
        Games.Add(game);

        return game;
    }

    /// <summary>
    ///     Finds a game by its ID.
    /// </summary>
    /// <param name="id">The ID of the game.</param>
    /// <returns>The game with the specified ID, or null if no game was found.</returns>
    public Game? FindGameById(Guid id) => Games.FirstOrDefault(game => game.Id == id);

    /// <summary>
    ///     Finds a game by the given username.
    /// </summary>
    /// <param name="username">The username to search for.</param>
    /// <returns>
    ///     The found game, if any. Returns null if no game is found.
    /// </returns>
    public Game? FindGameByUsername(string username) =>
        Games.FirstOrDefault(game => game.Players.Exists(player => player.Username == username));
}
