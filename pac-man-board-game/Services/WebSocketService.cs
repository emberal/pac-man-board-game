using System.Net.WebSockets;
using pacMan.Utils;

namespace pacMan.Services;

public interface IWebSocketService
{
    Task Send(WebSocket webSocket, ArraySegment<byte> segment);
    Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer);
    Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string? closeStatusDescription);
}

public class WebSocketService(ILogger logger) : IWebSocketService
{
    public async Task Send(WebSocket webSocket, ArraySegment<byte> segment)
    {
        await webSocket.SendAsync(
            segment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);

        logger.LogDebug("Message sent through WebSocket");
    }

    public async Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer)
    {
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        logger.LogDebug(
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

        logger.LogInformation("WebSocket connection closed");
    }
}
