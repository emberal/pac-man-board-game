using pacMan.Game;
using pacMan.Game.Items;

namespace pacMan.Services;

public class GameService : WebSocketService
{
    public GameService(ILogger<GameService> logger) : base(logger) { }

    public SynchronizedCollection<GameGroup> Games { get; } = new();

    public event Func<ArraySegment<byte>, Task>? Connections; // TODO remove and use GameGroup

    public void SendToAll(ArraySegment<byte> segment)
    {
        Connections?.Invoke(segment);
    }

    public GameGroup AddPlayer(IPlayer player, Queue<DirectionalPosition> spawns)
    {
        var index = 0;
        try
        {
            while (!Games[index].AddPlayer(player)) index++;
        }
        catch (ArgumentOutOfRangeException)
        {
            var game = new GameGroup(spawns);
            game.AddPlayer(player);
            Games.Add(game);
        }

        return Games[index];
    }
}
