using System.Text.Json.Serialization;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public class Game // TODO handle disconnects and reconnects
{
    private readonly Random _random = new();
    private int _currentPlayerIndex;

    public Game(Queue<DirectionalPosition> spawns) => Spawns = spawns;

    [JsonInclude] public Guid Id { get; } = Guid.NewGuid();

    [JsonIgnore] public List<IPlayer> Players { get; } = new();

    [JsonIgnore] private Queue<DirectionalPosition> Spawns { get; }

    [JsonInclude] public int Count => Players.Count;

    [JsonInclude]
    public bool IsGameStarted => Count > 0 && Players.All(player => player.State is State.InGame or State.Disconnected);

    public IPlayer NextPlayer()
    {
        try
        {
            _currentPlayerIndex = (_currentPlayerIndex + 1) % Count;
        }
        catch (DivideByZeroException)
        {
            throw new InvalidOperationException("There are no players in the game group.");
        }

        return Players[_currentPlayerIndex];
    }

    public void Shuffle() => Players.Sort((_, _) => _random.Next(-1, 2));

    public event Func<ArraySegment<byte>, Task>? Connections;

    public bool AddPlayer(IPlayer player)
    {
        if (Players.Count >= Rules.MaxPlayers || IsGameStarted) return false;

        player.State = State.WaitingForPlayers;
        if (Players.Exists(p => p.Name == player.Name)) return true;
        Players.Add(player);
        if (player.PacMan.SpawnPosition is null) SetSpawn(player);
        return true;
    }

    private void SetSpawn(IPlayer player)
    {
        if (player.PacMan.SpawnPosition is not null) return;
        var spawn = Spawns.Dequeue();
        player.PacMan.SpawnPosition = spawn;
        player.PacMan.Position = spawn;
    }

    public void SendToAll(ArraySegment<byte> segment) => Connections?.Invoke(segment);

    public IEnumerable<IPlayer> SetReady(IPlayer player)
    {
        if (!Players.Contains(player)) // TODO throws exception after game has started and refresh
            throw new PlayerNotFoundException("The player was not found in the game group.");
        player.State = State.Ready;
        return Players;
    }

    public bool SetAllInGame()
    {
        if (Players.Any(player => player.State != State.Ready)) return false;

        foreach (var player in Players) player.State = State.InGame;
        return true;
    }
}
