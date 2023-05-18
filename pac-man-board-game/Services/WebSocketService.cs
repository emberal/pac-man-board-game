using System.Net.WebSockets;
using System.Text;
using pacMan.Interfaces;
using pacMan.Utils;

namespace pacMan.Services;

public class WebSocketService : IWebSocketService
{
    private readonly ILogger<WebSocketService> _logger;
    private readonly SynchronizedCollection<WebSocket> _webSockets = new();

    public WebSocketService(ILogger<WebSocketService> logger)
    {
        _logger = logger;
        logger.Log(LogLevel.Debug, "WebSocket Service created");
    }

    public void Add(WebSocket webSocket)
    {
        _webSockets.Add(webSocket);
        _logger.Log(LogLevel.Debug, "WebSocket added to list");
    }

    public bool Remove(WebSocket webSocket)
    {
        var taken = _webSockets.Remove(webSocket);
        _logger.Log(LogLevel.Debug, "WebSocket removed from list");
        return taken;
    }

    public async Task Send(WebSocket webSocket, string message, int length)
    {
        var bytes = Encoding.UTF8.GetBytes(message);
        await Send(webSocket, bytes, length);
    }

    public async Task Send(WebSocket webSocket, byte[] message, int length)
    {
        var msgSegment = new ArraySegment<byte>(message, 0, length);
        await webSocket.SendAsync(
            msgSegment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);
        
        _logger.Log(LogLevel.Trace,
            "Message \"{}\" sent to WebSocket",
            message.GetString(length));
    }

    public async Task SendToAll(string message, int length)
    {
        var serverMsg = Encoding.UTF8.GetBytes(message);
        await SendToAll(serverMsg, length);
    }

    public async Task SendToAll(byte[] message, int length)
    {
        foreach (var ws in _webSockets) await Send(ws, message, length);

        _logger.Log(LogLevel.Debug, "Message sent to all WebSockets");
    }

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
    
    public int CountConnected() => _webSockets.Count;
}