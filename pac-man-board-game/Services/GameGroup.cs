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

        Players.Add(player);
        return true;
    }

    public void SendToAll(ArraySegment<byte> segment)
    {
        Connections?.Invoke(segment);
    }
}