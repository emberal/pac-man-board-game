using System.Text.Json.Serialization;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

/// <summary>
///     Represents a game instance.
/// </summary>
public class Game(Queue<DirectionalPosition> spawns)
{
    private readonly Random _random = new();
    private int _currentPlayerIndex;
    private List<Player> _players = [];

    [JsonInclude] public Guid Id { get; } = Guid.NewGuid();

    /// <summary>
    ///     Gets or sets the list of players.
    ///     When setting, the mutable values of the players are updated instead of replacing the list.
    /// </summary>
    [JsonIgnore]
    public List<Player> Players
    {
        get => _players;
        set
        {
            if (_players.Count > 0)
                _players = _players.Select((player, index) =>
                {
                    player.State = value[index].State;
                    player.PacMan = value[index].PacMan;
                    player.Box = value[index].Box;
                    return player;
                }).ToList();
            else
                _players = value;
        }
    }

    [JsonIgnore] public List<Character> Ghosts { get; set; } = []; // TODO include

    /// <summary>
    ///     The spawn locations on the map.
    /// </summary>
    /// <value>
    ///     A Queue of DirectionalPositions representing the spawn locations on the map.
    /// </value>
    [JsonIgnore]
    private Queue<DirectionalPosition> Spawns { get; } = spawns;

    [JsonIgnore] public DiceCup DiceCup { get; } = new(); // TODO include

    [JsonInclude] public int Count => Players.Count;

    // TODO edge-case when game has started but all players have disconnected, Disconnected property?
    /// <summary>
    ///     Whether or not the game has started.
    /// </summary>
    /// <remarks>
    ///     The game is considered started if the count is greater than zero and at least one player is in the "InGame" state.
    /// </remarks>
    [JsonInclude]
    public bool IsGameStarted => Count > 0 && Players.Any(player => player.State is State.InGame);

    /// <summary>
    ///     Gets the next player in the game.
    /// </summary>
    /// <returns>The next player.</returns>
    /// <exception cref="PlayerNotFoundException">Thrown when there are no players in the game.</exception>
    public Player NextPlayer()
    {
        try
        {
            _currentPlayerIndex = (_currentPlayerIndex + 1) % Count;
        }
        catch (DivideByZeroException)
        {
            throw new PlayerNotFoundException("There are no players in the game.");
        }

        return Players[_currentPlayerIndex];
    }

    public void Shuffle() => Players.Sort((_, _) => _random.Next(-1, 2));

    /// <summary>
    ///     An event that is invoked when a message is to be sent to all connections.
    ///     Each player in the game should be listening to this event.
    /// </summary>
    /// <remarks>
    ///     The event handler is of type <see cref="Func{T, TResult}" /> which accepts an <see cref="ArraySegment{T}" /> of
    ///     bytes and returns a <see cref="Task" />.
    ///     This event is typically used to perform some action when something happens.
    /// </remarks>
    public event Func<ArraySegment<byte>, Task>? Connections;

    /// <summary>
    ///     Adds a player to the game.
    /// </summary>
    /// <param name="player">The player to be added.</param>
    /// <exception cref="GameNotPlayableException">Thrown when the game is already full or has already started.</exception>
    public void AddPlayer(Player player)
    {
        if (Players.Count >= Rules.MaxPlayers)
            throw new GameNotPlayableException("Game is full");
        if (IsGameStarted)
            throw new GameNotPlayableException("Game has already started");

        player.State = State.WaitingForPlayers;
        if (Players.Exists(p => p.Username == player.Username)) return;

        Players.Add(player);
        if (player.PacMan.SpawnPosition is null) SetSpawn(player);
    }

    public Player? RemovePlayer(string username)
    {
        var index = Players.FindIndex(p => p.Username == username);
        if (index == -1) return null;
        var removedPlayer = Players[index];
        Players.RemoveAt(index);
        return removedPlayer;
    }

    /// <summary>
    ///     Sets the spawn position and current position of the specified player's PacMan character.
    /// </summary>
    /// <param name="player">The player whose PacMan character's spawn and current positions will be set.</param>
    private void SetSpawn(Player player)
    {
        if (player.PacMan.SpawnPosition is not null) return;
        var spawn = Spawns.Dequeue();
        player.PacMan.SpawnPosition = spawn;
        player.PacMan.Position = spawn;
    }

    /// <summary>
    ///     Sends the specified byte segment to all connected clients.
    /// </summary>
    /// <param name="segment">The byte segment to send.</param>
    public void SendToAll(ArraySegment<byte> segment) => Connections?.Invoke(segment);

    /// <summary>
    ///     Sets the state of the player with the specified username to Ready.
    /// </summary>
    /// <param name="username">The username of the player.</param>
    /// <returns>An enumerable collection of Player objects.</returns>
    public IEnumerable<Player> SetReady(string username)
    {
        var player = Players.FirstOrDefault(p => p.Username == username);
        if (player is null)
            throw new PlayerNotFoundException("The player was not found in the game group.");
        player.State = State.Ready;
        return Players;
    }

    /// <summary>
    ///     Sets all players to the "InGame" state if they are currently in the "Ready" state.
    /// </summary>
    /// <returns>
    ///     Returns true if all players were successfully set to the "InGame" state, false otherwise.
    /// </returns>
    public bool SetAllInGame()
    {
        if (Players.Any(player => player.State is not State.Ready)) return false;

        foreach (var player in Players) player.State = State.InGame;
        return true;
    }

    /// <summary>
    ///     Finds a player by their username.
    /// </summary>
    /// <param name="username">The username of the player to find.</param>
    /// <returns>The found Player object if a player with the given username is found; otherwise, null.</returns>
    public Player? FindPlayerByUsername(string username) =>
        Players.FirstOrDefault(player => player.Username == username);
}
