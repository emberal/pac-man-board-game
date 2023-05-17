using System.Net.WebSockets;

namespace pacMan.Interfaces;

public interface IWebSocketService
{
    void Add(WebSocket webSocket);
    void Remove(WebSocket webSocket);
    Task Send(WebSocket webSocket, string message, int length);
    Task Send(WebSocket webSocket, byte[] message, int length);
    Task SendToAll(string message, int length);
    Task SendToAll(byte[] message, int length);
    Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer);
    Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string closeStatusDescription);
}