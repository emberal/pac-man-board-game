using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Interfaces;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WsController : ControllerBase
{
    private readonly ILogger<WsController> _logger;
    private readonly IWebSocketService _wsService;
    private const int BufferSize = 1024 * 4;

    public WsController(ILogger<WsController> logger, IWebSocketService wsService)
    {
        _logger = logger;
        _wsService = wsService;
        _logger.Log(LogLevel.Debug, "WebSocket Controller created");
    }

    [HttpGet]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            _logger.Log(LogLevel.Information, "WebSocket connection established to {}", HttpContext.Connection.Id);
            _wsService.Add(webSocket);
            await Echo(webSocket);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private async Task Echo(WebSocket webSocket)
    {
        try
        {
            var buffer = new byte[BufferSize];
            WebSocketReceiveResult? result;
            do
            {
                result = await _wsService.Receive(webSocket, buffer);
                
                if (result.CloseStatus.HasValue) break;

                await _wsService.SendToAll(buffer, result.Count);
            } while (true);

            await _wsService.Close(webSocket, result.CloseStatus.Value, result.CloseStatusDescription ?? "No reason");
        }
        catch (WebSocketException e)
        {
            _logger.Log(LogLevel.Error, "{}", e.Message);
        }

        _wsService.Remove(webSocket);
    }
}