using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.GameStuff;
using pacMan.Services;
using pacMan.Utils;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : GenericController // TODO reconnect using player id
{
    private readonly IActionService _actionService;
    private readonly GameService _gameService;

    public GameController(ILogger<GameController> logger, GameService gameService, IActionService actionService) :
        base(logger, gameService)
    {
        _gameService = gameService;
        _actionService = actionService;
    }

    [HttpGet("connect")]
    public override async Task Accept() => await base.Accept();

    [HttpGet("allGames")]
    public IEnumerable<Game> GetAllGames()
    {
        Logger.Log(LogLevel.Information, "Returning all games");
        return _gameService.Games;
    }


    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var stringResult = data.GetString(result.Count);

        Logger.Log(LogLevel.Information, "Received: {}", stringResult);
        var action = ActionMessage.FromJson(stringResult);

        _actionService.DoAction(action);
        return action.ToArraySegment();
    }

    protected override void Send(ArraySegment<byte> segment) => _gameService.SendToAll(segment);

    protected override Task Echo()
    {
        _gameService.Connections += WsServiceOnFire;
        return base.Echo();
    }

    protected override void Disconnect()
    {
        _gameService.Connections -= WsServiceOnFire;
        _actionService.Disconnect();
    }

    private async Task WsServiceOnFire(ArraySegment<byte> segment)
    {
        if (WebSocket == null) return;
        await GameService.Send(WebSocket, segment);
    }
}
