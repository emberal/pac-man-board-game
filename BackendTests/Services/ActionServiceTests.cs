using System.Text.Json;
using BackendTests.TestUtils;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;
using pacMan.Services;

namespace BackendTests.Services;

public class ActionServiceTests
{
    private readonly Player _blackPlayer = Players.Create("black");
    private readonly Player _redPlayer = Players.Create("red");
    private readonly Player _whitePlayer = Players.Create("white");
    private ActionMessage _blackMessage = null!;
    private pacMan.Services.Game _game = null!;
    private GameService _gameService = null!;
    private ActionMessage _redMessage = null!;
    private IActionService _service = null!;

    private Queue<DirectionalPosition> _spawns = null!;
    private ActionMessage _whiteMessage = null!;


    [SetUp]
    public void Setup()
    {
        _spawns = CreateQueue();
        _game = new pacMan.Services.Game(_spawns);
        _whiteMessage = new ActionMessage { Action = GameAction.JoinGame, Data = SerializeData(_whitePlayer.Username) };
        _blackMessage = new ActionMessage { Action = GameAction.JoinGame, Data = SerializeData(_blackPlayer.Username) };
        _redMessage = new ActionMessage { Action = GameAction.JoinGame, Data = SerializeData(_redPlayer.Username) };
        _gameService = Substitute.For<GameService>(Substitute.For<ILogger<GameService>>());
        _service = new ActionService(Substitute.For<ILogger<ActionService>>(), _gameService);
    }

    private JsonElement SerializeData(string username) =>
        JsonDocument.Parse(JsonSerializer.Serialize(
            new JoinGameData { Username = username, GameId = _game.Id }
        )).RootElement;

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
        var message = new ActionMessage { Action = GameAction.JoinGame, Data = "null" };
        var serialized = JsonDocument.Parse(JsonSerializer.Serialize(message.Data));
        Assert.Throws<JsonException>(() => _service.FindGame(serialized.RootElement));
        message.Data = null;
        Assert.Throws<NullReferenceException>(() => _service.FindGame(message.Data));
    }

    [Test]
    public void PlayerInfo_DataIsNotJoinGameData()
    {
        var serialized = JsonDocument.Parse(JsonSerializer.Serialize(new Box { Colour = "white" }));
        var message = new ActionMessage { Action = GameAction.JoinGame, Data = serialized.RootElement };
        Assert.Throws<JsonException>(() => _service.FindGame(message.Data));
    }

    [Test]
    public void PlayerInfo_DataIsUsernameAndGameId()
    {
        _game.AddPlayer(_whitePlayer);
        _gameService.Games.Add(_game);
        var players = _service.FindGame(_whiteMessage.Data);

        Assert.That(players, Is.InstanceOf<IEnumerable<Player>>());
        Assert.That(new List<Player> { _whitePlayer }, Is.EqualTo(players));
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
        Assert.Throws<PlayerNotFoundException>(() => _service.Ready());
    }

    [Test]
    public void Ready_NotAllReady()
    {
        _gameService.Games.Add(_game);
        var game = _gameService.JoinById(_game.Id, _whitePlayer);
        _gameService.JoinById(game.Id, _blackPlayer);

        _service.FindGame(_whiteMessage.Data); // Sets white to ready

        var result = _service.Ready();
        Assert.That(result.AllReady, Is.False);

        _gameService.JoinById(game.Id, _redPlayer);
        _service.FindGame(_redMessage.Data); // Sets red to ready

        result = _service.Ready();
        Assert.That(result.AllReady, Is.False);
    }

    [Test]
    public void Ready_OneReady()
    {
        _gameService.Games.Add(_game);
        _gameService.JoinById(_game.Id, _whitePlayer);
        _service.FindGame(_whiteMessage.Data); // Sets white to ready

        var result = _service.Ready();
        // If selected the state is changed to InGame
        _whitePlayer.State = State.InGame;
        Assert.That(result.Players.First().Username, Is.EqualTo(_whitePlayer.Username));
    }

    [Test]
    public void Ready_TwoReady()
    {
        var group = new pacMan.Services.Game(new Queue<DirectionalPosition>())
        {
            Players = { _blackPlayer, _whitePlayer }
        };
        _service.Game = group;
        _service.Player = _blackPlayer;

        var result = _service.Ready();

        Assert.That(result.AllReady, Is.EqualTo(false));

        _service.Player = _whitePlayer;

        result = _service.Ready();

        Assert.That(result.Players.First().Username,
            Is.EqualTo(_blackPlayer.Username).Or.EqualTo(_whitePlayer.Username));
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
                new[] { new DirectionalPosition { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up } }
            )) { Players = { _whitePlayer } };

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
