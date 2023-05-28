using System.Net.WebSockets;
using pacMan.Interfaces;
using pacMan.Utils;

namespace pacMan.Services;

public class WebSocketService : IWebSocketService
{
    private readonly ILogger<WebSocketService> _logger;
    public event Func<ArraySegment<byte>, Task>? Connections; // TODO separate connections into groups (1 event per game)

    public WebSocketService(ILogger<WebSocketService> logger)
    {
        _logger = logger;
        logger.Log(LogLevel.Debug, "WebSocket Service created");
    }

    public async Task Send(WebSocket webSocket, ArraySegment<byte> segment)
    {
        await webSocket.SendAsync(
            segment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);

        _logger.Log(LogLevel.Trace, "Message sent to WebSocket");
    }

    public void SendToAll(ArraySegment<byte> segment) => Connections?.Invoke(segment);

    public async Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer)
    {
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        _logger.Log(LogLevel.Debug,
            "Message \"{}\" received from WebSocket",
            buffer.GetString(result.Count));
        return result;
    }

    public async Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus,
        string closeStatusDescription = "No reason")
    {
        await webSocket.CloseAsync(
            closeStatus,
            closeStatusDescription,
            CancellationToken.None);
        _logger.Log(LogLevel.Information, "WebSocket connection closed");
    }

    public int CountConnected() => Connections?.GetInvocationList().Length ?? 0;
}