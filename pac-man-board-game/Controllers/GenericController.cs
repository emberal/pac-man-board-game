using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Interfaces;

namespace pacMan.Controllers;

public abstract class GenericController : ControllerBase
{
    protected readonly ILogger<GenericController> Logger;
    private readonly IWebSocketService _wsService;
    private const int BufferSize = 1024 * 4;

    protected GenericController(ILogger<GenericController> logger, IWebSocketService wsService)
    {
        Logger = logger;
        _wsService = wsService;
        Logger.Log(LogLevel.Debug, "WebSocket Controller created");
    }

    public virtual async Task Accept()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            Logger.Log(LogLevel.Information, "WebSocket connection established to {}", HttpContext.Connection.Id);
            _wsService.Add(webSocket);
            await Echo(webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    protected virtual async Task Echo(WebSocket webSocket)
    {
        try
        {
            WebSocketReceiveResult? result;
            do
            {
                var buffer = new byte[BufferSize];
                result = await _wsService.Receive(webSocket, buffer);

                if (result.CloseStatus.HasValue) break;

                var segment = Run(result, buffer);

                await _wsService.SendToAll(segment);
            } while (true);

            await _wsService.Close(webSocket, result.CloseStatus.Value, result.CloseStatusDescription ?? "No reason");
        }
        catch (WebSocketException e)
        {
            Logger.Log(LogLevel.Error, "{}", e.Message);
        }

        _wsService.Remove(webSocket);
    }

    protected abstract ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data);
}