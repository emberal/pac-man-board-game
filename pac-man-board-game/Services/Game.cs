using System.Text.Json.Serialization;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public class Game(Queue<DirectionalPosition> spawns)
{
    private readonly Random _random = new();
    private int _currentPlayerIndex;
    private List<Player> _players = new();

    [JsonInclude] public Guid Id { get; } = Guid.NewGuid();

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

    [JsonIgnore] public List<Character> Ghosts { get; set; } = new(); // TODO include

    [JsonIgnore] private Queue<DirectionalPosition> Spawns { get; } = spawns;

    [JsonIgnore] public DiceCup DiceCup { get; } = new(); // TODO include

    [JsonInclude] public int Count => Players.Count;

    // TODO edge-case when game has started but all players have disconnected, Disconnected property?
    [JsonInclude] public bool IsGameStarted => Count > 0 && Players.Any(player => player.State is State.InGame);

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

    public event Func<ArraySegment<byte>, Task>? Connections;

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

    private void SetSpawn(Player player)
    {
        if (player.PacMan.SpawnPosition is not null) return;
        var spawn = Spawns.Dequeue();
        player.PacMan.SpawnPosition = spawn;
        player.PacMan.Position = spawn;
    }

    public void SendToAll(ArraySegment<byte> segment) => Connections?.Invoke(segment);

    public IEnumerable<Player> SetReady(string username)
    {
        var player = Players.FirstOrDefault(p => p.Username == username);
        if (player is null)
            throw new PlayerNotFoundException("The player was not found in the game group.");
        player.State = State.Ready;
        return Players;
    }

    public bool SetAllInGame()
    {
        if (Players.Any(player => player.State is not State.Ready)) return false;

        foreach (var player in Players) player.State = State.InGame;
        return true;
    }

    public Player? FindPlayerByUsername(string username) =>
        Players.FirstOrDefault(player => player.Username == username);
}
