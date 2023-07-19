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
            Data = SerializeData(_whitePlayer)
        };
        _blackMessage = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = SerializeData(_blackPlayer)
        };
        _redMessage = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = SerializeData(_redPlayer)
        };
        _gameService = Substitute.For<GameService>(Substitute.For<ILogger<GameService>>());
        _service = new ActionService(Substitute.For<ILogger<ActionService>>(), _gameService);
    }

    private static JsonElement SerializeData(Player player) =>
        JsonDocument.Parse(JsonSerializer.Serialize(
            new PlayerInfoData { Player = player, Spawns = CreateQueue() })
        ).RootElement;

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
        _service.Game = new pacMan.Services.Game(new Queue<DirectionalPosition>());
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
        var serialized = JsonDocument.Parse(JsonSerializer.Serialize(message.Data));
        Assert.Throws<JsonException>(() => _service.SetPlayerInfo(serialized.RootElement));
        message.Data = null;
        Assert.Throws<NullReferenceException>(() => _service.SetPlayerInfo(message.Data));
    }

    [Test]
    public void PlayerInfo_DataIsNotPlayer()
    {
        var serialized =
            JsonDocument.Parse(JsonSerializer.Serialize(new Box { Colour = "white", Pellets = new List<Pellet>() }));
        var message = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = serialized.RootElement
        };
        Assert.Throws<JsonException>(() => _service.SetPlayerInfo(message.Data));
    }

    [Test]
    public void PlayerInfo_DataIsPlayer()
    {
        var players = _service.SetPlayerInfo(_whiteMessage.Data);

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
        _service.SetPlayerInfo(_whiteMessage.Data);
        _service.SetPlayerInfo(_blackMessage.Data);

        var result = _service.Ready();
        if (result is ReadyData r1)
            Assert.That(r1.AllReady, Is.False);
        else
            Assert.Fail("Result should be ReadyData");

        _service.SetPlayerInfo(_redMessage.Data);

        result = _service.Ready();
        if (result is ReadyData r2)
            Assert.That(r2.AllReady, Is.False);
        else
            Assert.Fail("Result should be ReadyData");
    }

    [Test]
    public void Ready_OneReady()
    {
        _service.SetPlayerInfo(_whiteMessage.Data);
        var result = _service.Ready();
        // If selected the state is changed to InGame
        _whitePlayer.State = State.InGame;
        var players = result.GetType().GetProperty("Players")?.GetValue(result) as IEnumerable<IPlayer>;
        Assert.That(players?.First().Username, Is.EqualTo(_whitePlayer.Username));
    }

    [Test]
    public void Ready_TwoReady()
    {
        var group = new pacMan.Services.Game(new Queue<DirectionalPosition>())
            { Players = { _blackPlayer, _whitePlayer } };
        _service.Game = group;
        _service.Player = _blackPlayer;

        var result = _service.Ready();

        Assert.That(result.GetType().GetProperty("AllReady")?.GetValue(result), Is.EqualTo(false));

        _service.Player = _whitePlayer;

        result = _service.Ready();

        var players = result.GetType().GetProperty("Players")?.GetValue(result) as IEnumerable<IPlayer>;
        Assert.That(players?.First().Username, Is.EqualTo(_blackPlayer.Username).Or.EqualTo(_whitePlayer.Username));
    }

    #endregion

    #region FindNextPlayer()

    [Test]
    public void FindNextPlayer_NoPlayers()
    {
        _service.Game = new pacMan.Services.Game(new Queue<DirectionalPosition>());
        Assert.Throws<InvalidOperationException>(() => _service.FindNextPlayer());
    }

    [Test]
    public void FindNextPlayer_OnePlayer()
    {
        _service.Game =
            new pacMan.Services.Game(new Queue<DirectionalPosition>(
                    new[] { new DirectionalPosition { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up } }))
                { Players = { _whitePlayer } };

        var name = _service.FindNextPlayer();
        Assert.That(name, Is.EqualTo(_whitePlayer.Username));
    }

    [Test]
    public void FindNextPlayer_TwoPlayers()
    {
        _service.Game = new pacMan.Services.Game(new Queue<DirectionalPosition>(
            new[]
            {
                new DirectionalPosition { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up },
                new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down }
            })) { Players = { _whitePlayer, _blackPlayer } };

        var first = _service.FindNextPlayer();
        Assert.That(first, Is.EqualTo(_blackPlayer.Username));
        var second = _service.FindNextPlayer();
        Assert.That(second, Is.EqualTo(_whitePlayer.Username));
    }

    #endregion
}
