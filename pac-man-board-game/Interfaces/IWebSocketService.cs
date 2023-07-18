using System.Net.WebSockets;

namespace pacMan.Interfaces;

public interface IWebSocketService
{
    Task Send(WebSocket webSocket, ArraySegment<byte> segment);
    Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer);
    Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string? closeStatusDescription);
}
