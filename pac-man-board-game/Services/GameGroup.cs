using pacMan.Game;
using pacMan.Game.Interfaces;

namespace pacMan.Services;

public class GameGroup
{
    public List<IPlayer> Players { get; } = new();
    public event Func<ArraySegment<byte>, Task>? Connections;

    public bool AddPlayer(IPlayer player)
    {
        if (Players.Count >= Rules.MaxPlayers) return false;
        if (Players.Exists(p => p.Name == player.Name)) return false;

        player.State = State.WaitingForPlayers;
        Players.Add(player);
        return true;
    }

    public void SendToAll(ArraySegment<byte> segment)
    {
        Connections?.Invoke(segment);
    }

    public bool AllReady()
    {
        return Players.All(p => p.State == State.Ready);
    }

    public void SetReady(IPlayer player)
    {
        player.State = State.Ready;
    }
}