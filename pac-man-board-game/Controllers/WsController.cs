using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Services;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WsController(ILogger<WsController> logger, IWebSocketService gameService) :
    GenericController(logger, gameService)
{
    [HttpGet]
    public override async Task Connect() => await base.Connect();

    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var segment = new ArraySegment<byte>(data, 0, result.Count);
        return segment;
    }
}
