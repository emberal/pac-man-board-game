using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Controllers;
using pacMan.GameStuff;
using pacMan.Services;
using pacMan.Utils;

namespace BackendTests.Controllers;

[TestFixture]
[TestOf(nameof(GameController))]
public class GameControllerTests
{
    [SetUp]
    public void Setup()
    {
        _gameService = Substitute.For<GameService>(Substitute.For<ILogger<GameService>>());
        _actionService = Substitute.For<ActionService>(
            Substitute.For<ILogger<ActionService>>(), _gameService
        );
        _controller = new GameController(Substitute.For<ILogger<GameController>>(), _gameService, _actionService);
    }

    private IActionService _actionService = null!;
    private GameController _controller = null!;
    private GameService _gameService = null!;

    [Test]
    public void Run_ReturnsSame()
    {
        var message = new ActionMessage { Action = (GameAction)(-1), Data = "{\"text\":\"Hello World!\"}" };
        var data = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        var wssResult = new WebSocketReceiveResult(data.Length, WebSocketMessageType.Text, true);

        var runMethod = _controller.GetType().GetMethod("Run", BindingFlags.Instance | BindingFlags.NonPublic);

        if (runMethod is null) Assert.Fail("Run method not found");

        var result = runMethod!.Invoke(_controller, new object[] { wssResult, data });

        if (result is ArraySegment<byte> resultSegment)
            Assert.Multiple(() =>
            {
                Assert.That(resultSegment, Has.Count.EqualTo(data.Length));
                Assert.That(Encoding.UTF8.GetString(resultSegment.ToArray()), Is.EqualTo(data.GetString(data.Length)));
            });
        // TODO not working, works like a normal method call
        // _actionService.ReceivedWithAnyArgs().DoAction(default!);
        else
            Assert.Fail("Result is not an ArraySegment<byte>");
    }

    [Test]
    public void DoAction_NegativeAction()
    {
        const string data = "Nothing happens";
        var message = new ActionMessage { Action = (GameAction)(-1), Data = data };
        _controller.DoAction(message);
        Assert.That(message.Data, Is.EqualTo(data));
    }

    [Test]
    public void DoAction_OutOfBoundsAction()
    {
        const string data = "Nothing happens";
        var message = new ActionMessage { Action = (GameAction)100, Data = data };
        _controller.DoAction(message);
        Assert.That(message.Data, Is.EqualTo(data));
    }
}
