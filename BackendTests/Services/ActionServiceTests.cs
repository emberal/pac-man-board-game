using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Game;
using pacMan.Interfaces;
using pacMan.Services;

namespace BackendTests.Services;

public class ActionServiceTests
{
    private IActionService _service = null!;
    private IWebSocketService _wssMock = null!;

    [SetUp]
    public void Setup()
    {
        _wssMock = Substitute.For<WebSocketService>(Substitute.For<ILogger<WebSocketService>>());
        _service = new ActionService(Substitute.For<ILogger<ActionService>>(), _wssMock);
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
        Assert.Fail();
    }

    [Test]
    public void PlayerInfo_DataIsPlayer()
    {
        Assert.Fail();
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
