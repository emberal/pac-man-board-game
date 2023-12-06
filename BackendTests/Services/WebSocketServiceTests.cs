using System.Net.WebSockets;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pacMan.Services;
using pacMan.Utils;

namespace BackendTests.Services;

[TestFixture]
[TestOf(nameof(WebSocketService))]
public class WebSocketServiceTests
{
    [SetUp]
    public void SetUp()
    {
        _service = new WebSocketService(Substitute.For<ILogger<WebSocketService>>());
    }

    private IWebSocketService _service = null!;

    [Test]
    public void Send_OpenWebsocket()
    {
        var segment = "test".ToArraySegment();
        using var webSocket = Substitute.For<WebSocket>();

        _service.Send(webSocket, segment).Wait();

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
}
