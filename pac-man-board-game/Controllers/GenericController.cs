using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Interfaces;

namespace pacMan.Controllers;

public abstract class GenericController : ControllerBase
{
    private const int BufferSize = 1024 * 4;
    protected readonly ILogger<GenericController> Logger;
    protected readonly IWebSocketService WsService;
    private WebSocket? _webSocket;

    protected GenericController(ILogger<GenericController> logger, IWebSocketService wsService)
    {
        Logger = logger;
        WsService = wsService;
        Logger.Log(LogLevel.Debug, "WebSocket Controller created");
    }

    public virtual async Task Accept()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            Logger.Log(LogLevel.Information, "WebSocket connection established to {}", HttpContext.Connection.Id);
            _webSocket = webSocket;
            WsService.Connections += WsServiceOnFire;
            await Echo();
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private async Task WsServiceOnFire(ArraySegment<byte> segment)
    {
        if (_webSocket == null) return;
        await WsService.Send(_webSocket, segment);
    }


    protected virtual async Task Echo()
    {
        if (_webSocket == null) return;
        try
        {
            WebSocketReceiveResult? result;
            do
            {
                var buffer = new byte[BufferSize];
                result = await WsService.Receive(_webSocket, buffer);

                if (result.CloseStatus.HasValue) break;

                var segment = Run(result, buffer);

                WsService.SendToAll(segment);
            } while (true);

            await WsService.Close(_webSocket, result.CloseStatus.Value, result.CloseStatusDescription);
        }
        catch (WebSocketException e)
        {
            Logger.Log(LogLevel.Error, "{}", e.Message);
        }

        WsService.Connections -= WsServiceOnFire;
    }

    protected abstract ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data);
}
