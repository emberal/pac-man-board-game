using System.Text.Json.Serialization;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public class Game
{
    private readonly Random _random = new();
    private int _currentPlayerIndex;
    private List<Player> _players = new();

    public Game(Queue<DirectionalPosition> spawns) => Spawns = spawns;

    [JsonInclude] public Guid Id { get; } = Guid.NewGuid();

    [JsonIgnore]
    public List<Player> Players
    {
        get => _players;
        set =>
            _players = _players.Select((player, index) =>
            {
                player.State = value[index].State;
                player.PacMan = value[index].PacMan;
                player.Box = value[index].Box;
                return player;
            }).ToList();
    }

    [JsonIgnore] public List<Character> Ghosts { get; set; } = new(); // TODO include

    [JsonIgnore] private Queue<DirectionalPosition> Spawns { get; }

    [JsonIgnore] public DiceCup DiceCup { get; } = new(); // TODO include

    [JsonInclude] public int Count => Players.Count;

    [JsonInclude] public bool IsGameStarted => Count > 0 && Players.Any(player => player.State is State.InGame);

    public Player NextPlayer()
    {
        try
        {
            _currentPlayerIndex = (_currentPlayerIndex + 1) % Count;
        }
        catch (DivideByZeroException)
        {
            throw new InvalidOperationException("There are no players in the game.");
        }

        return Players[_currentPlayerIndex];
    }

    public void Shuffle() => Players.Sort((_, _) => _random.Next(-1, 2));

    public event Func<ArraySegment<byte>, Task>? Connections;

    public bool AddPlayer(Player player)
    {
        if (Players.Count >= Rules.MaxPlayers || IsGameStarted) return false;
        /* TODO remove above and uncomment below
          if (Players.Count >= Rules.MaxPlayers)
            throw new GameNotPlayableException("Game is full");
        if (IsGameStarted)
            throw new GameNotPlayableException("Game has already started");
         */

        player.State = State.WaitingForPlayers;
        if (Players.Exists(p => p.Username == player.Username)) return true; // TODO change to false
        Players.Add(player);
        if (player.PacMan.SpawnPosition is null) SetSpawn(player);
        return true;
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
        if (Players.Any(player => player.State != State.Ready)) return false;

        foreach (var player in Players) player.State = State.InGame;
        return true;
    }
}
