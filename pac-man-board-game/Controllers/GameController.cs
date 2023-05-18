using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Interfaces;
using pacMan.Utils;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : GenericController
{
    private readonly IDiceCup _diceCup;
    public GameController(ILogger<GameController> logger, IWebSocketService wsService) : base(logger, wsService)
    {
        _diceCup = new DiceCup();
    }

    [HttpGet]
    public override async Task Accept() => await base.Accept();

    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var stringResult = data.GetString(data.Length);
        Logger.Log(LogLevel.Information, "Received: {}", stringResult);
        
        var rolls = _diceCup.Roll();
        Logger.Log(LogLevel.Information, "Rolled {}", string.Join(", ", rolls));

        return rolls.ToArraySegment();
    }
}