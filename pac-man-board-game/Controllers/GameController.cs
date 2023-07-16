using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Game;
using pacMan.Interfaces;
using pacMan.Services;
using pacMan.Utils;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : GenericController // TODO reconnect using player id
{
    private readonly IActionService _actionService;

    public GameController(ILogger<GameController> logger, IWebSocketService wsService, IActionService actionService) :
        base(logger, wsService) =>
        _actionService = actionService;

    [HttpGet]
    public override async Task Accept() => await base.Accept();

    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var stringResult = data.GetString(result.Count);

        Logger.Log(LogLevel.Information, "Received: {}", stringResult);
        var action = ActionMessage.FromJson(stringResult);

        _actionService.DoAction(action);
        return action.ToArraySegment();
    }

    protected override void Disconnect()
    {
        base.Disconnect();
        _actionService.Disconnect();
    }
}
