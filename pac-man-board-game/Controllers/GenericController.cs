using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Services;

namespace pacMan.Controllers;

public abstract class GenericController(ILogger<GenericController> logger, IWebSocketService webSocketService)
    : ControllerBase
{
    private const int BufferSize = 1024 * 4;
    protected readonly ILogger<GenericController> Logger = logger;
    protected WebSocket? WebSocket;

    public virtual async Task Connect()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            Logger.LogInformation("WebSocket connection established to {}", HttpContext.Connection.Id);
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
        if (WebSocket is null) return;
        try
        {
            WebSocketReceiveResult? result;
            do
            {
                var buffer = new byte[BufferSize];
                result = await webSocketService.Receive(WebSocket, buffer);

                if (result.CloseStatus.HasValue) break;

                var segment = Run(result, buffer);

                Send(segment);
            } while (true);

            var disconnectSegment = Disconnect();
            if (disconnectSegment is not null)
                SendDisconnectMessage((ArraySegment<byte>)disconnectSegment);

            await webSocketService.Close(WebSocket, result.CloseStatus.Value, result.CloseStatusDescription);
        }
        catch (WebSocketException e)
        {
            Logger.LogError("{}", e.Message);
        }
    }

    protected virtual async void Send(ArraySegment<byte> segment)
    {
        if (WebSocket is null) return;
        await webSocketService.Send(WebSocket, segment);
    }

    protected abstract ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data);

    protected virtual ArraySegment<byte>? Disconnect() => null;

    protected virtual void SendDisconnectMessage(ArraySegment<byte> segment) { }
}
