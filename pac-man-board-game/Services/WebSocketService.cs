using System.Net.WebSockets;
using pacMan.Game.Interfaces;
using pacMan.Interfaces;
using pacMan.Utils;

namespace pacMan.Services;

public class WebSocketService : IWebSocketService
{
    private readonly ILogger<WebSocketService> _logger;

    public WebSocketService(ILogger<WebSocketService> logger)
    {
        _logger = logger;
        logger.Log(LogLevel.Debug, "WebSocket Service created");
    }

    public SynchronizedCollection<GameGroup> Games { get; } = new();

    public int CountConnected => Connections?.GetInvocationList().Length ?? 0;

    public event Func<ArraySegment<byte>, Task>? Connections; // TODO remove and use GameGroup

    public async Task Send(WebSocket webSocket, ArraySegment<byte> segment)
    {
        await webSocket.SendAsync(
            segment,
            WebSocketMessageType.Text,
            true,
            CancellationToken.None);

        _logger.Log(LogLevel.Debug, "Message sent to WebSocket");
    }

    public void SendToAll(ArraySegment<byte> segment)
    {
        Connections?.Invoke(segment);
    }

    public async Task<WebSocketReceiveResult> Receive(WebSocket webSocket, byte[] buffer)
    {
        var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        _logger.Log(LogLevel.Debug,
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

        _logger.Log(LogLevel.Information, "WebSocket connection closed");
    }

    public GameGroup AddPlayer(IPlayer player)
    {
        var index = 0;
        try
        {
            while (!Games[index].AddPlayer(player)) index++;
        }
        catch (ArgumentOutOfRangeException)
        {
            var game = new GameGroup();
            game.AddPlayer(player);
            Games.Add(game);
        }

        return Games[index];
    }
}
