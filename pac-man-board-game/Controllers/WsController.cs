using System.Net.WebSockets;
using System.Text;
using Microsoft.AspNetCore.Mvc;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WsController : ControllerBase
{
    private readonly ILogger<WsController> _logger;

    public WsController(ILogger<WsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            _logger.Log(LogLevel.Information, "WebSocket connection established to {}", HttpContext.Connection.Id);
            await Echo(webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private async Task Echo(WebSocket webSocket)
    {
        var buffer = new byte[1024 * 4];
        WebSocketReceiveResult? result;

        do
        {
            result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            _logger.Log(LogLevel.Information, "Message received from Client");

            if (result.CloseStatus.HasValue) break;

            var serverMsg = Encoding.UTF8.GetBytes(Encoding.UTF8.GetString(buffer));

            await webSocket.SendAsync(
                new ArraySegment<byte>(serverMsg, 0, result.Count),
                result.MessageType,
                result.EndOfMessage, CancellationToken.None);

            _logger.Log(LogLevel.Information, "Message sent to Client");
        } while (true);

        await webSocket.CloseAsync(
            result.CloseStatus.Value,
            result.CloseStatusDescription,
            CancellationToken.None);
        _logger.Log(LogLevel.Information, "WebSocket connection closed from {}", HttpContext.Connection.Id);
    }
}