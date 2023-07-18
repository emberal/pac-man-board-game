using BackendTests.TestUtils;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Exceptions;
using pacMan.GameStuff;
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

    #region JoinbyId(Guid id)

    [Test]
    public void JoinById_WhenIdNotExists()
    {
        var player = Players.Create("white");
        _service.AddPlayer(player, _spawns);

        Assert.Throws<GameNotFoundException>(() => _service.JoinById(Guid.NewGuid(), player));
    }
    
    [Test]
    public void JoinById_WhenIdExists()
    {
        var player = Players.Create("white");
        var group = _service.AddPlayer(player, _spawns);

        var player2 = Players.Create("black");
        var result = _service.JoinById(group.Id, player2);

        Assert.Multiple(() =>
        {
            Assert.That(result, Is.EqualTo(group));
            Assert.That(group.Players, Has.Count.EqualTo(2));
            Assert.That(_service.Games, Has.Count.EqualTo(1));
        });
    }

    #endregion

    #region AddPlayer(IPlayer)

    [Test]
    public void AddPlayer_ToEmptyGroup()
    {
        var player = Players.Create("white");
        var group = _service.AddPlayer(player, _spawns);

        Assert.Multiple(() =>
        {
            Assert.That(group.Players, Has.Count.EqualTo(1));
            Assert.That(group.NextPlayer, Is.EqualTo(player));
            Assert.That(_service.Games, Has.Count.EqualTo(1));
        });
    }

    [Test]
    public void AddPlayer_ToFullGroup()
    {
        for (var i = 0; i < 4; i++)
        {
            var player = Players.Create(i.ToString());
            _service.AddPlayer(player, _spawns);
        }

        var player5 = Players.Create("white");

        var group = _service.AddPlayer(player5, new Queue<DirectionalPosition>(new[] { _spawn3By3Up }));

        Assert.Multiple(() =>
        {
            Assert.That(group.Players, Has.Count.EqualTo(1));
            Assert.That(group.NextPlayer, Is.EqualTo(player5));
            Assert.That(_service.Games, Has.Count.EqualTo(2));
            Assert.That(_service.Games.First(), Has.Count.EqualTo(Rules.MaxPlayers));
        });
    }

    #endregion
}
