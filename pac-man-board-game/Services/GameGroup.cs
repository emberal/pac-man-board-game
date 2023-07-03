using pacMan.Game;
using pacMan.Game.Interfaces;

namespace pacMan.Services;

public class GameGroup // TODO tests
{
    private readonly Random _random = new();
    public List<IPlayer> Players { get; } = new();

    public IPlayer RandomPlayer => Players[_random.Next(Players.Count)];
    public event Func<ArraySegment<byte>, Task>? Connections;

    public bool AddPlayer(IPlayer player)
    {
        if (Players.Count >= Rules.MaxPlayers) return false;
        if (Players.Exists(p => p.Name == player.Name)) return false;

        player.State = State.WaitingForPlayers;
        Players.Add(player);
        return true;
    }

    public void SendToAll(ArraySegment<byte> segment) => Connections?.Invoke(segment);

    public IEnumerable<IPlayer> SetReady(IPlayer player)
    {
        player.State = State.Ready;
        return Players;
    }
}
