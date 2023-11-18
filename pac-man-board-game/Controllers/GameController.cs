using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.DTOs;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;
using pacMan.Services;
using pacMan.Utils;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController(ILogger<GameController> logger, IGameService webSocketService, IActionService actionService)
    : GenericController(logger, webSocketService)
{
    [HttpGet("[action]")]
    public override async Task Connect() => await base.Connect();

    [HttpGet("[action]")]
    public IEnumerable<Game> All()
    {
        Logger.LogDebug("Returning all games");
        return webSocketService.Games;
    }

    [HttpPost("[action]/{gameId:guid}")]
    public IActionResult Join(Guid gameId, [FromBody] Player player) // TODO what if player is in a game already?
    {
        Logger.LogDebug("Joining game {}", gameId);
        try
        {
            webSocketService.JoinById(gameId, player);
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

    [HttpGet("[action]/{gameId:guid}")]
    public IActionResult Exists(Guid gameId)
    {
        Logger.LogDebug("Checking if game {} exists", gameId);
        return webSocketService.Games.Any(game => game.Id == gameId) ? Ok() : NotFound();
    }

    [HttpPost("[action]")]
    public IActionResult Create([FromBody] CreateGameData data)
    {
        Logger.LogDebug("Creating game");
        try
        {
            var game = webSocketService.CreateAndJoin(data.Player, data.Spawns);
            return Created($"/{game.Id}", game);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }

    protected override Task Echo()
    {
        actionService.WebSocket = WebSocket ?? throw new NullReferenceException("WebSocket is null");
        return base.Echo();
    }

    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var stringResult = data.GetString(result.Count);

        Logger.LogInformation("Received: {}", stringResult);
        var action = ActionMessage.FromJson(stringResult);

        try
        {
            DoAction(action);
        }
        catch (Exception e)
        {
            Logger.LogError("{}", e.Message);
            action = new ActionMessage { Action = GameAction.Error, Data = e.Message };
        }

        return action.ToArraySegment();
    }

    protected override async void Send(ArraySegment<byte> segment)
    {
        if (actionService.Game is not null)
            actionService.SendToAll(segment);
        else if (WebSocket is not null)
            await webSocketService.Send(WebSocket, segment);
    }

    protected override ArraySegment<byte>? Disconnect() =>
        new ActionMessage { Action = GameAction.Disconnect, Data = actionService.Disconnect() }
            .ToArraySegment();

    protected override void SendDisconnectMessage(ArraySegment<byte> segment) => actionService.SendToAll(segment);

    public void DoAction(ActionMessage message) =>
        message.Data = message.Action switch
        {
            GameAction.RollDice => actionService.RollDice(),
            GameAction.MoveCharacter => actionService.HandleMoveCharacter(message.Data),
            GameAction.JoinGame => actionService.FindGame(message.Data),
            GameAction.Ready => actionService.Ready(),
            GameAction.NextPlayer => actionService.FindNextPlayer(),
            GameAction.Disconnect => actionService.LeaveGame(),
            _ => message.Data
        };
}
