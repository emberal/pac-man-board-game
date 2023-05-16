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
    public async void TestWebSocket()
    {
        // TODO test websocket https://learn.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-7.0
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            _logger.Log(LogLevel.Information, "Accepted WebSocket connection from {ConnectionId}",
                HttpContext.Connection.Id);
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
        WebSocketReceiveResult? receiveResult;

        // While the WebSocket connection remains open run a simple loop that receives data and sends it back.
        do
        {
            // Receive the request and store it in a buffer
            receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);

            _logger.Log(LogLevel.Information, "Received {Count} bytes", receiveResult.Count);

            if (receiveResult.CloseStatus.HasValue) break;
            var msg = Encoding.UTF8.GetString(buffer);
            _logger.Log(LogLevel.Information, "Received {Message}", msg);

            // Send the request back to the client
            await webSocket.SendAsync(
                new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                receiveResult.MessageType,
                receiveResult.EndOfMessage,
                CancellationToken.None);

            _logger.Log(LogLevel.Information, "Sent {Count} bytes", receiveResult.Count);
        } while (true);

        // Close the WebSocket connection
        await webSocket.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
        _logger.Log(LogLevel.Information, "Closed WebSocket connection {ConnectionId}",
            HttpContext.Connection.Id);
    }
}