using System.Collections;
using pacMan.Exceptions;
using pacMan.Game;
using pacMan.Game.Items;

namespace pacMan.Services;

public class GameGroup : IEnumerable<IPlayer> // TODO handle disconnects and reconnects
{
    private readonly Random _random = new();

    public GameGroup(Queue<DirectionalPosition> spawns) => Spawns = spawns;

    public List<IPlayer> Players { get; } = new();
    private Queue<DirectionalPosition> Spawns { get; }

    public IPlayer RandomPlayer => Players[_random.Next(Count)];

    public int Count => Players.Count;

    public IEnumerator<IPlayer> GetEnumerator() => Players.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();

    public event Func<ArraySegment<byte>, Task>? Connections;

    public bool AddPlayer(IPlayer player) // TODO if name exists, use that player instead
    {
        if (Players.Count >= Rules.MaxPlayers) return false;

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
