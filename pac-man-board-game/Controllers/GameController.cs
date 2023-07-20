using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;
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

    [HttpGet("all")]
    public IEnumerable<Game> GetAllGames()
    {
        Logger.Log(LogLevel.Debug, "Returning all games");
        return _gameService.Games;
    }

    [HttpPost("join/{gameId}")]
    public IActionResult JoinGame(Guid gameId, [FromBody] Player player) // TODO what if player is in a game already?
    {
        Logger.Log(LogLevel.Debug, "Joining game {}", gameId);
        try
        {
            _gameService.JoinById(gameId, player);
            return Ok("Game joined successfully");
        }
        catch (GameNotFoundException e)
        {
            return NotFound(e.Message);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    [HttpPost("create")]
    public IActionResult CreateGame([FromBody] PlayerInfoData data)
    {
        Logger.Log(LogLevel.Debug, "Creating game");
        try
        {
            var game = _gameService.CreateAndJoin(data.Player, data.Spawns);
            return Created($"/{game.Id}", game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message); // TODO not necessary?
        }
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
        // _actionService.Game.Connections += WsServiceOnFire;
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
