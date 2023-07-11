using pacMan.Exceptions;
using pacMan.Game;
using pacMan.Game.Interfaces;

namespace pacMan.Services;

public class GameGroup // TODO tests
{
    private readonly Random _random = new();
    public List<IPlayer> Players { get; } = new();

    public IPlayer RandomPlayer => Players[_random.Next(Players.Count)];
    public event Func<ArraySegment<byte>, Task>? Connections;

    public bool AddPlayer(IPlayer player) // TODO if name exists, use that player instead
    {
        if (Players.Count >= Rules.MaxPlayers) return false;

        player.State = State.WaitingForPlayers;
        if (Players.Exists(p => p.Name == player.Name)) return true;
        Players.Add(player);
        return true;
    }

    public void SendToAll(ArraySegment<byte> segment) => Connections?.Invoke(segment);

    public IEnumerable<IPlayer> SetReady(IPlayer player)
    {
        if (!Players.Contains(player))
            throw new PlayerNotFoundException("The player was not found in the game group.");
        player.State = State.Ready;
        return Players;
    }

    public void SetAllInGame()
    {
        foreach (var player in Players) player.State = State.InGame;
    }
}
