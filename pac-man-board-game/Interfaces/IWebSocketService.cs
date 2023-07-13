using System.Net.WebSockets;
using pacMan.Game.Interfaces;
using pacMan.Services;

namespace pacMan.Interfaces;

public interface IWebSocketService
{
    SynchronizedCollection<GameGroup> Games { get; }
    int CountConnected { get; }
    event Func<ArraySegment<byte>, Task>? Connections;
    Task Send(WebSocket webSocket, ArraySegment<byte> segment);
    void SendToAll(ArraySegment<byte> segment);
    Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer);
    Task Close(WebSocket webSocket, WebSocketCloseStatus closeStatus, string? closeStatusDescription);
    GameGroup AddPlayer(IPlayer player);
}
