using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Services;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WsController : GenericController
{
    public WsController(ILogger<WsController> logger, GameService gameService) : base(logger, gameService) { }

    [HttpGet]
    public override async Task Accept() => await base.Accept();

    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var segment = new ArraySegment<byte>(data, 0, result.Count);
        return segment;
    }
}
