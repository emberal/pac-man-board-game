using System.Net.WebSockets;
using BackendTests.TestUtils;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Game;
using pacMan.Interfaces;
using pacMan.Services;
using pacMan.Utils;

namespace BackendTests.Services;

public class WebSocketServiceTests
{
    private readonly DirectionalPosition _spawn3By3Up = new()
        { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up };

    private IWebSocketService _service = null!;

    private Queue<DirectionalPosition> _spawns = null!;


    [SetUp]
    public void SetUp()
    {
        _service = new WebSocketService(Substitute.For<ILogger<WebSocketService>>());
        _spawns = new Queue<DirectionalPosition>(new[]
        {
            _spawn3By3Up,
            new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down },
            new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down },
            new DirectionalPosition { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down }
        });
    }

    #region Send(Websocket, ArraySegment<byte>)

    [Test]
    public void Send_OpenWebsocket()
    {
        var segment = "test".ToArraySegment();
        using var webSocket = Substitute.For<WebSocket>();

        _service.Send(webSocket, segment);

        webSocket.ReceivedWithAnyArgs().SendAsync(default, default, default, default);
    }

    [Test]
    public void Send_ClosedWebsocket()
    {
        var segment = "test".ToArraySegment();
        using var webSocket = Substitute.For<WebSocket>();
        webSocket.State.Returns(WebSocketState.Closed);

        Assert.That(webSocket.State, Is.Not.EqualTo(WebSocketState.Open).Or.EqualTo(WebSocketState.CloseReceived));

        webSocket
            .WhenForAnyArgs(x => x.SendAsync(default, default, default, default))
            .Do(_ => throw new WebSocketException());

        Assert.ThrowsAsync<WebSocketException>(async () => await _service.Send(webSocket, segment));

        webSocket.Received().SendAsync(segment, WebSocketMessageType.Text, true, CancellationToken.None);
    }

    #endregion

    #region Receive(Websocket, byte[])

    [Test]
    public void Receive_ExactBuffer()
    {
        const int bufferSize = 16;
        var buffer = new byte[bufferSize];
        var segment = "0123456789ABCDEF".ToArraySegment();
        var webSocket = Substitute.For<WebSocket>();

        webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None)
            .Returns(new WebSocketReceiveResult(bufferSize, WebSocketMessageType.Text, true))
            .AndDoes(_ => buffer = segment.ToArray());

        var result = _service.Receive(webSocket, buffer).Result;

        Assert.Multiple(() =>
        {
            Assert.That(result, Has.Count.EqualTo(bufferSize));
            Assert.That(buffer.GetString(buffer.Length), Is.EqualTo(segment.ToArray().GetString(buffer.Length)));
        });
    }

    [Test]
    public void Receive_CloseWebsocket()
    {
        using var webSocket = Substitute.For<WebSocket>();
        webSocket.State.Returns(WebSocketState.Closed);

        Assert.That(webSocket.State, Is.Not.EqualTo(WebSocketState.Open).Or.EqualTo(WebSocketState.CloseReceived));

        webSocket
            .WhenForAnyArgs(x => x.ReceiveAsync(default, default))
            .Do(_ => throw new WebSocketException());

        Assert.ThrowsAsync<WebSocketException>(async () => await _service.Receive(webSocket, new byte[] { }));

        webSocket.ReceivedWithAnyArgs().ReceiveAsync(default, CancellationToken.None);
    }

    #endregion

    #region Close(Websocket, WebSocketCloseStatus, string?)

    [Test]
    public void Close_OpenWebsocket()
    {
        using var webSocket = Substitute.For<WebSocket>();
        webSocket.State.Returns(WebSocketState.Open);

        Assert.That(webSocket.State, Is.EqualTo(WebSocketState.Open).Or.EqualTo(WebSocketState.CloseReceived));

        _service.Close(webSocket, WebSocketCloseStatus.NormalClosure, null).Wait();

        webSocket.ReceivedWithAnyArgs().CloseAsync(default, default, CancellationToken.None);
    }

    [Test]
    public void Close_ClosedWebsocket()
    {
        using var webSocket = Substitute.For<WebSocket>();
        webSocket.State.Returns(WebSocketState.Closed);

        Assert.That(webSocket.State, Is.Not.EqualTo(WebSocketState.Open).Or.EqualTo(WebSocketState.CloseReceived));

        webSocket
            .WhenForAnyArgs(x => x.CloseAsync(default, default, default))
            .Do(_ => throw new WebSocketException());

        Assert.ThrowsAsync<WebSocketException>(async () =>
            await _service.Close(webSocket, WebSocketCloseStatus.NormalClosure, null));

        webSocket.ReceivedWithAnyArgs().CloseAsync(default, default, CancellationToken.None);
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
            Assert.That(group.RandomPlayer, Is.EqualTo(player));
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
            Assert.That(group.RandomPlayer, Is.EqualTo(player5));
            Assert.That(_service.Games, Has.Count.EqualTo(2));
            Assert.That(_service.Games.First(), Has.Count.EqualTo(Rules.MaxPlayers));
        });
    }

    #endregion
}
