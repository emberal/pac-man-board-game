using System.Text.Json;
using BackendTests.TestUtils;
using Microsoft.CSharp.RuntimeBinder;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Interfaces;
using pacMan.Services;

namespace BackendTests.Services;

public class ActionServiceTests
{
    private IActionService _service = null!;
    private IWebSocketService _wssSub = null!;

    [SetUp]
    public void Setup()
    {
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
        Assert.Throws<NullReferenceException>(() => _service.PlayerInfo(message));
        message.Data = null;
        Assert.Throws<NullReferenceException>(() => _service.PlayerInfo(message));
    }

    [Test]
    public void PlayerInfo_DataIsNotPlayer()
    {
        var message = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = new Box { Colour = "white", Pellets = new List<Pellet>() }
        };
        Assert.Throws<RuntimeBinderException>(() => _service.PlayerInfo(message));
    }

    [Test]
    public void PlayerInfo_DataIsPlayer()
    {
        var player = Players.Create("white");
        var message = new ActionMessage
        {
            Action = GameAction.PlayerInfo,
            Data = JsonSerializer.Serialize(player)
        };
        var players = _service.PlayerInfo(message);

        Assert.That(new List<IPlayer> { player }, Is.EqualTo(players));
    }

    #endregion

    #region DoAction(ActionMessage message)

    [Test]
    public void DoAction_NegativeAction()
    {
        Assert.Fail();
    }

    [Test]
    public void DoAction_OutOfBoundsAction()
    {
        Assert.Fail();
    }

    #endregion

    #region Ready()

    [Test]
    public void Ready_PlayerIsNull()
    {
        Assert.Fail();
    }

    [Test]
    public void Ready_SomeReady()
    {
        Assert.Fail();
    }

    [Test]
    public void Ready_AllReady()
    {
        Assert.Fail();
    }

    #endregion
}
