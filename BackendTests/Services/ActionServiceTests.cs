using System.Text.Json;
using BackendTests.TestUtils;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;
using pacMan.Services;

namespace BackendTests.Services;

public class ActionServiceTests
{
    private readonly Player _blackPlayer = (Player)Players.Create("black");
    private readonly Player _redPlayer = (Player)Players.Create("red");

    private readonly Player _whitePlayer = (Player)Players.Create("white");
    private ActionMessage _blackMessage = null!;
    private GameService _gameService = null!;
    private ActionMessage _redMessage = null!;
    private IActionService _service = null!;

    private Queue<DirectionalPosition> _spawns = null!;

    private ActionMessage _whiteMessage = null!;

    [SetUp]
    public void Setup()
    {
        _spawns = CreateQueue();
        _whiteMessage = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = JsonSerializer.Serialize(new { Player = _whitePlayer, Spawns = CreateQueue() })
        };
        _blackMessage = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = JsonSerializer.Serialize(new { Player = _blackPlayer, Spawns = CreateQueue() })
        };
        _redMessage = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = JsonSerializer.Serialize(new { Player = _redPlayer, Spawns = CreateQueue() })
        };
        _gameService = Substitute.For<GameService>(Substitute.For<ILogger<GameService>>());
        _service = new ActionService(Substitute.For<ILogger<ActionService>>(), _gameService);
    }

    private static Queue<DirectionalPosition> CreateQueue() =>
        new(new[]
        {
            new DirectionalPosition { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up },
            new() { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down },
            new() { At = new Position { X = 5, Y = 5 }, Direction = Direction.Left },
            new() { At = new Position { X = 9, Y = 9 }, Direction = Direction.Right }
        });

    #region RollDice()

    [Test]
    public void RollDice_ReturnsListOfIntegers()
    {
        var dices = _service.RollDice();
        Assert.Multiple(() =>
        {
            Assert.That(dices, Has.Count.EqualTo(2));
            Assert.That(dices, Has.All.InRange(1, 6));
        });
    }

    #endregion

    #region PlayerInfo(ActionMessage message)

    [Test]
    public void PlayerInfo_DataIsNull()
    {
        var message = new ActionMessage { Action = GameAction.PlayerInfo, Data = "null" };
        Assert.Throws<JsonException>(() => _service.SetPlayerInfo(message));
        message.Data = null;
        Assert.Throws<NullReferenceException>(() => _service.SetPlayerInfo(message));
    }

    [Test]
    public void PlayerInfo_DataIsNotPlayer()
    {
        var message = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = JsonSerializer.Serialize(new Box { Colour = "white", Pellets = new List<Pellet>() })
        };
        Assert.Throws<JsonException>(() => _service.SetPlayerInfo(message));
    }

    [Test]
    public void PlayerInfo_DataIsPlayer()
    {
        var players = _service.SetPlayerInfo(_whiteMessage);

        var pos = _spawns.Dequeue();
        _whitePlayer.PacMan.Position = pos;
        _whitePlayer.PacMan.SpawnPosition = pos;
        Assert.That(new List<IPlayer> { _whitePlayer }, Is.EqualTo(players));
    }

    #endregion

    #region DoAction(ActionMessage message)

    [Test]
    public void DoAction_NegativeAction()
    {
        const string data = "Nothing happens";
        var message = new ActionMessage { Action = (GameAction)(-1), Data = data };
        _service.DoAction(message);
        Assert.That(message.Data, Is.EqualTo(data));
    }

    [Test]
    public void DoAction_OutOfBoundsAction()
    {
        const string data = "Nothing happens";
        var message = new ActionMessage { Action = (GameAction)100, Data = data };
        _service.DoAction(message);
        Assert.That(message.Data, Is.EqualTo(data));
    }

    #endregion

    #region Ready()

    [Test]
    public void Ready_PlayerIsNull()
    {
        var result = _service.Ready();
        Assert.That(result, Is.InstanceOf<string>());
    }

    [Test]
    public void Ready_NotAllReady()
    {
        _service.SetPlayerInfo(_whiteMessage);
        _service.SetPlayerInfo(_blackMessage);

        var result = _service.Ready();
        if (result is ReadyData r1)
            Assert.That(r1.AllReady, Is.False);
        else
            Assert.Fail("Result should be ReadyData");

        _service.SetPlayerInfo(_redMessage);

        result = _service.Ready();
        if (result is ReadyData r2)
            Assert.That(r2.AllReady, Is.False);
        else
            Assert.Fail("Result should be ReadyData");
    }

    [Test]
    public void Ready_OneReady()
    {
        _service.SetPlayerInfo(_whiteMessage);
        var result = _service.Ready();
        // If selected the state is changed to InGame
        _whitePlayer.State = State.InGame;
        var players = result.GetType().GetProperty("Players")?.GetValue(result) as IEnumerable<IPlayer>;
        Assert.That(players?.First().Name, Is.EqualTo(_whitePlayer.Name));
    }

    [Test]
    public void Ready_TwoReady()
    {
        var group = new pacMan.Services.Game(new Queue<DirectionalPosition>())
            { Players = { _blackPlayer, _whitePlayer } };
        _service.Group = group;
        _service.Player = _blackPlayer;

        var result = _service.Ready();

        Assert.That(result.GetType().GetProperty("AllReady")?.GetValue(result), Is.EqualTo(false));

        _service.Player = _whitePlayer;

        result = _service.Ready();

        var players = result.GetType().GetProperty("Players")?.GetValue(result) as IEnumerable<IPlayer>;
        Assert.That(players?.First().Name, Is.EqualTo(_blackPlayer.Name).Or.EqualTo(_whitePlayer.Name));
    }

    #endregion

    #region FindNextPlayer()

    [Test]
    public void FindNextPlayer_NoPlayers()
    {
        _service.Group = new pacMan.Services.Game(new Queue<DirectionalPosition>());
        Assert.Throws<InvalidOperationException>(() => _service.FindNextPlayer());
    }

    [Test]
    public void FindNextPlayer_OnePlayer()
    {
        _service.Group =
            new pacMan.Services.Game(new Queue<DirectionalPosition>(
                    new[] { new DirectionalPosition { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up } }))
                { Players = { _whitePlayer } };

        var name = _service.FindNextPlayer();
        Assert.That(name, Is.EqualTo(_whitePlayer.Name));
    }

    [Test]
    public void FindNextPlayer_TwoPlayers()
    {
        _service.Group = new pacMan.Services.Game(new Queue<DirectionalPosition>(
            new[]
            {
                new DirectionalPosition { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up },
                new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down }
            })) { Players = { _whitePlayer, _blackPlayer } };

        var first = _service.FindNextPlayer();
        Assert.That(first, Is.EqualTo(_blackPlayer.Name));
        var second = _service.FindNextPlayer();
        Assert.That(second, Is.EqualTo(_whitePlayer.Name));
    }

    #endregion
}
