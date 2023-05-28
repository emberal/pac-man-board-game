using System.Net.WebSockets;

namespace pacMan.Interfaces;

public interface IWebSocketService
{
    event Func<ArraySegment<byte>, Task>? Connections;
    Task Send(WebSocket webSocket, ArraySegment<byte> segment);
    void SendToAll(ArraySegment<byte> segment);
    Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer);
    Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string closeStatusDescription);
    int CountConnected();
}