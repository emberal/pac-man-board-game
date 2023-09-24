using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Interfaces;

namespace pacMan.Controllers;

public abstract class GenericController : ControllerBase
{
    private const int BufferSize = 1024 * 4;
    private readonly IWebSocketService _webSocketService;
    protected readonly ILogger<GenericController> Logger;
    protected WebSocket? WebSocket;

    protected GenericController(ILogger<GenericController> logger, IWebSocketService webSocketService)
    {
        Logger = logger;
        _webSocketService = webSocketService;
        Logger.Log(LogLevel.Debug, "WebSocket Controller created");
    }

    public virtual async Task Accept()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            Logger.Log(LogLevel.Information, "WebSocket connection established to {}", HttpContext.Connection.Id);
            WebSocket = webSocket;
            await Echo();
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    protected virtual async Task Echo()
    {
        if (WebSocket == null) return;
        try
        {
            WebSocketReceiveResult? result;
            do
            {
                var buffer = new byte[BufferSize];
                result = await _webSocketService.Receive(WebSocket, buffer);

                if (result.CloseStatus.HasValue) break;

                var segment = Run(result, buffer);

                Send(segment);
            } while (true);

            var disconnectSegment = Disconnect();
            if (disconnectSegment != null) 
                SendDisconnectMessage((ArraySegment<byte>)disconnectSegment);

            await _webSocketService.Close(WebSocket, result.CloseStatus.Value, result.CloseStatusDescription);
        }
        catch (WebSocketException e)
        {
            Logger.Log(LogLevel.Error, "{}", e.Message);
        }
    }

    protected virtual async void Send(ArraySegment<byte> segment)
    {
        if (WebSocket == null) return;
        await _webSocketService.Send(WebSocket, segment);
    }

    protected abstract ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data);

    protected virtual ArraySegment<byte>? Disconnect() => null;

    protected virtual void SendDisconnectMessage(ArraySegment<byte> segment) { }
}
