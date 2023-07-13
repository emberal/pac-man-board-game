using System.Text.Json;
using BackendTests.TestUtils;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Game;
using pacMan.Game.Items;
using pacMan.Interfaces;
using pacMan.Services;

namespace BackendTests.Services;

public class ActionServiceTests
{
    private readonly IPlayer _blackPlayer = Players.Create("black");
    private readonly IPlayer _redPlayer = Players.Create("red");
    private readonly IPlayer _whitePlayer = Players.Create("white");
    private ActionMessage _blackMessage = null!;
    private ActionMessage _redMessage = null!;
    private IActionService _service = null!;
    private ActionMessage _whiteMessage = null!;
    private IWebSocketService _wssSub = null!;

    [SetUp]
    public void Setup()
    {
        _whiteMessage = new ActionMessage
            { Action = GameAction.PlayerInfo, Data = JsonSerializer.Serialize(_whitePlayer) };
        _blackMessage = new ActionMessage
            { Action = GameAction.PlayerInfo, Data = JsonSerializer.Serialize(_blackPlayer) };
        _redMessage = new ActionMessage { Action = GameAction.PlayerInfo, Data = JsonSerializer.Serialize(_redPlayer) };
        _wssSub = Substitute.For<WebSocketService>(Substitute.For<ILogger<WebSocketService>>());
        _service = new ActionService(Substitute.For<ILogger<ActionService>>(), _wssSub);
    }

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
        Assert.Throws<NullReferenceException>(() => _service.SetPlayerInfo(message));
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

        Assert.That(result.GetType().GetProperty("Starter"), Is.Null);

        _service.SetPlayerInfo(_redMessage);

        result = _service.Ready();

        Assert.That(result.GetType().GetProperty("Starter"), Is.Null);
    }

    [Test]
    public void Ready_OneReady()
    {
        _service.SetPlayerInfo(_whiteMessage);
        var result = _service.Ready();
        // If selected the state is changed to InGame
        _whitePlayer.State = State.InGame;
        Assert.That(result.GetType().GetProperty("Starter")?.GetValue(result), Is.EqualTo(_whitePlayer));
    }

    [Test]
    public void Ready_TwoReady()
    {
        var group = new GameGroup { Players = { _blackPlayer, _whitePlayer } };
        _service.Group = group;
        _service.Player = _blackPlayer;

        var result = _service.Ready();

        Assert.That(result.GetType().GetProperty("Starter"), Is.Null);

        _service.Player = _whitePlayer;

        result = _service.Ready();

        Assert.That(result.GetType().GetProperty("Starter")?.GetValue(result),
            Is.EqualTo(_whitePlayer).Or.EqualTo(_blackPlayer));
    }

    #endregion
}
