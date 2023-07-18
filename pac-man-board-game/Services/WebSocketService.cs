using System.Net.WebSockets;
using pacMan.Interfaces;
using pacMan.Utils;

namespace pacMan.Services;


public class WebSocketService : IWebSocketService
{
    protected readonly ILogger<WebSocketService> Logger;

    public WebSocketService(ILogger<WebSocketService> logger)
    {
        Logger = logger;
        logger.Log(LogLevel.Debug, "WebSocket Service created");
    }

    public async Task Send(WebSocket webSocket, ArraySegment<byte> segment)
    {
        await webSocket.SendAsync(
            segment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);

        Logger.Log(LogLevel.Debug, "Message sent to WebSocket");
    }

    public async Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer)
    {
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        Logger.Log(LogLevel.Debug,
            "Message \"{}\" received from WebSocket",
            buffer.GetString(result.Count));
        return result;
    }

    public async Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string? closeStatusDescription)
    {
        await webSocket.CloseAsync(
            closeStatus,
            closeStatusDescription,
            CancellationToken.None);

        Logger.Log(LogLevel.Information, "WebSocket connection closed");
    }
}
