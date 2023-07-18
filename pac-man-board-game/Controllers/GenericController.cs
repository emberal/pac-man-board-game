using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Services;

namespace pacMan.Controllers;

public abstract class GenericController : ControllerBase // TODO only use WebSocketService in this class
{
    private const int BufferSize = 1024 * 4;
    protected readonly GameService GameService;
    protected readonly ILogger<GenericController> Logger;
    private WebSocket? _webSocket;

    protected GenericController(ILogger<GenericController> logger, GameService gameService)
    {
        Logger = logger;
        GameService = gameService;
        Logger.Log(LogLevel.Debug, "WebSocket Controller created");
    }

    public virtual async Task Accept()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            Logger.Log(LogLevel.Information, "WebSocket connection established to {}", HttpContext.Connection.Id);
            _webSocket = webSocket;
            GameService.Connections += WsServiceOnFire;
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
        await GameService.Send(_webSocket, segment);
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
                result = await GameService.Receive(_webSocket, buffer);

                if (result.CloseStatus.HasValue) break;

                var segment = Run(result, buffer);

                GameService.SendToAll(segment);
            } while (true);

            await GameService.Close(_webSocket, result.CloseStatus.Value, result.CloseStatusDescription);
        }
        catch (WebSocketException e)
        {
            Logger.Log(LogLevel.Error, "{}", e.Message);
        }

        Disconnect();
    }

    protected abstract ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data);

    protected virtual void Disconnect() => GameService.Connections -= WsServiceOnFire;
}
