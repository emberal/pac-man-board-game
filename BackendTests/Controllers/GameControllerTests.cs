using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Controllers;
using pacMan.Game;
using pacMan.Interfaces;
using pacMan.Services;
using pacMan.Utils;

namespace BackendTests.Controllers;

public class GameControllerTests
{
    private IActionService _actionService = null!;
    private GameController _controller = null!;
    private IWebSocketService _webSocketService = null!;

    [SetUp]
    public void Setup()
    {
        _webSocketService = Substitute.For<IWebSocketService>();
        _actionService = Substitute.For<ActionService>(
            Substitute.For<ILogger<ActionService>>(), _webSocketService
        );
        _controller = new GameController(Substitute.For<ILogger<GameController>>(), _webSocketService, _actionService);
    }

    [Test]
    public void Run()
    {
        var message = new ActionMessage { Action = (GameAction)(-1), Data = "{\"text\":\"Hello World!\"}" };
        var data = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        var wssResult = new WebSocketReceiveResult(data.Length, WebSocketMessageType.Text, true);

        var runMethod = _controller.GetType().GetMethod("Run", BindingFlags.Instance | BindingFlags.NonPublic);

        if (runMethod is null) Assert.Fail();

        var result = runMethod!.Invoke(_controller, new object[] { wssResult, data });

        if (result is ArraySegment<byte> resultSegment)
        {
            Assert.Multiple(() =>
            {
                Assert.That(resultSegment, Has.Count.EqualTo(data.Length));
                Assert.That(Encoding.UTF8.GetString(resultSegment.ToArray()), Is.EqualTo(data.GetString(data.Length)));
            });
            // TODO not working, works like a normal method call
            // _actionService.ReceivedWithAnyArgs().DoAction(default!);
        }
        else
        {
            Assert.Fail("Result is not an ArraySegment<byte>");
        }
    }
}
