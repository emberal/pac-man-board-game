using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public class GameService : WebSocketService
{
    public GameService(ILogger<GameService> logger) : base(logger) { }

    public SynchronizedCollection<Game> Games { get; } = new();

    public event Func<ArraySegment<byte>, Task>? Connections; // TODO remove and use GameGroup

    public void SendToAll(ArraySegment<byte> segment)
    {
        Connections?.Invoke(segment);
    }

    public Game AddPlayer(IPlayer player, Queue<DirectionalPosition> spawns)
    {
        var index = 0;
        try
        {
            while (!Games[index].AddPlayer(player)) index++;
        }
        catch (ArgumentOutOfRangeException)
        {
            var game = new Game(spawns);
            game.AddPlayer(player);
            Games.Add(game);
        }

        return Games[index];
    }

    public Game JoinById(Guid id, IPlayer player)
    {
        var game = Games.FirstOrDefault(g => g.Id == id) ?? throw new GameNotFoundException();
        var added = game.AddPlayer(player);

        if (!added) throw new ArgumentException("Game is full");

        return game;
    }
}
