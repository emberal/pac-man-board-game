using BackendTests.TestUtils;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;
using pacMan.Services;

namespace BackendTests.Services;

public class GameServiceTests
{
    private readonly DirectionalPosition _spawn3By3Up = new()
        { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up };

    private GameService _service = null!;
    private Queue<DirectionalPosition> _spawns = null!;

    [SetUp]
    public void SetUp()
    {
        _service = new GameService(Substitute.For<ILogger<GameService>>());
        _spawns = new Queue<DirectionalPosition>(new[]
        {
            _spawn3By3Up,
            new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down },
            new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down },
            new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down }
        });
    }

    #region CreateAndJoin(IPlayer player, Queue<DirectionalPosition> spawns)

    [Test]
    public void CreateAndJoin_WhenEmpty()
    {
        var player = Players.Create("white");
        var group = _service.CreateAndJoin(player, _spawns);

        Assert.Multiple(() =>
        {
            Assert.That(group.Players, Has.Count.EqualTo(1));
            Assert.That(group.NextPlayer, Is.EqualTo(player));
            Assert.That(_service.Games, Has.Count.EqualTo(1));
        });
    }

    [Test]
    public void CreateAndJoin_SpawnsAreNotEqualToMaxPlayers()
    {
        var player = Players.Create("white");
        _spawns.Dequeue();
        Assert.Throws<ArgumentException>(() => _service.CreateAndJoin(player, _spawns));
    }

    #endregion

    #region JoinbyId(Guid id)

    [Test]
    public void JoinById_WhenIdNotExists()
    {
        var player = Players.Create("white");
        _service.Games.Add(new pacMan.Services.Game(_spawns) { Players = new List<Player> { player } });

        Assert.Throws<GameNotFoundException>(() => _service.JoinById(Guid.NewGuid(), player));
    }

    [Test]
    public void JoinById_WhenIdExists()
    {
        var player = Players.Create("white");
        var game = new pacMan.Services.Game(_spawns) { Players = new List<Player> { player } };
        _service.Games.Add(game);


        var player2 = Players.Create("black");
        var result = _service.JoinById(_service.Games[0].Id, player2);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.EqualTo(game));
            Assert.That(game.Players, Has.Count.EqualTo(2));
            Assert.That(_service.Games, Has.Count.EqualTo(1));
        });
    }

    #endregion
}
