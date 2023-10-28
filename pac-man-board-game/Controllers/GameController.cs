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
public class GameController : GenericController
{
    private readonly IActionService _actionService;
    private readonly GameService _gameService;

    public GameController(ILogger<GameController> logger, GameService webSocketService, IActionService actionService) :
        base(logger, webSocketService)
    {
        _gameService = webSocketService;
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

    [HttpPost("join/{gameId:guid}")]
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

    [HttpGet("exists/{gameId:guid}")]
    public IActionResult GameExists(Guid gameId)
    {
        Logger.Log(LogLevel.Debug, "Checking if game {} exists", gameId);
        return _gameService.Games.Any(game => game.Id == gameId) ? Ok() : NotFound();
    }

    [HttpPost("create")]
    public IActionResult CreateGame([FromBody] CreateGameData data)
    {
        Logger.Log(LogLevel.Debug, "Creating game");
        try
        {
            var game = _gameService.CreateAndJoin(data.Player, data.Spawns);
            return Created($"/{game.Id}", game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    protected override Task Echo()
    {
        _actionService.WebSocket = WebSocket ?? throw new NullReferenceException("WebSocket is null");
        return base.Echo();
    }

    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var stringResult = data.GetString(result.Count);

        Logger.Log(LogLevel.Information, "Received: {}", stringResult);
        var action = ActionMessage.FromJson(stringResult);

        try
        {
            _actionService.DoAction(action);
        }
        catch (Exception e)
        {
            Logger.Log(LogLevel.Error, "{}", e.Message);
            action = new ActionMessage { Action = GameAction.Error, Data = e.Message };
        }

        return action.ToArraySegment();
    }

    protected override async void Send(ArraySegment<byte> segment)
    {
        if (_actionService.Game is not null)
            _actionService.SendToAll(segment);
        else if (WebSocket is not null)
            await _gameService.Send(WebSocket, segment);
    }

    protected override ArraySegment<byte>? Disconnect() =>
        new ActionMessage { Action = GameAction.Disconnect, Data = _actionService.Disconnect() }
            .ToArraySegment();

    protected override void SendDisconnectMessage(ArraySegment<byte> segment) => _actionService.SendToAll(segment);
}
