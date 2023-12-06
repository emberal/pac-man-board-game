using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using pacMan.DTOs;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;
using pacMan.Services;
using pacMan.Utils;

namespace pacMan.Controllers;

/// <summary>
///     Controls the game logic and handles requests related to games.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class GameController(ILogger<GameController> logger, IGameService webSocketService, IActionService actionService)
    : GenericController(logger, webSocketService)
{
    [HttpGet("[action]")]
    public override Task Connect() => base.Connect();

    /// <summary>
    ///     Retrieves all games from the WebSocketService.
    /// </summary>
    /// <returns>
    ///     An IEnumerable of Game objects representing all the games.
    /// </returns>
    [HttpGet("[action]")]
    public IEnumerable<Game> All()
    {
        Logger.LogDebug("Returning all games");
        return webSocketService.Games;
    }

    /// <summary>
    ///     Adds a player to a game.
    /// </summary>
    /// <param name="gameId">The unique identifier of the game.</param>
    /// <param name="player">The player to be joined.</param>
    /// <returns>An IActionResult representing the result of the operation.</returns>
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

    /// <summary>
    ///     Checks if a game with the specified ID exists.
    /// </summary>
    /// <param name="gameId">The ID of the game to check.</param>
    /// <returns>
    ///     Returns an <see cref="IActionResult" /> representing the result of the operation.
    ///     If a game with the specified ID exists, returns an <see cref="OkResult" />.
    ///     If a game with the specified ID doesn't exist, returns a <see cref="NotFoundResult" />.
    /// </returns>
    [HttpGet("[action]/{gameId:guid}")]
    public IActionResult Exists(Guid gameId)
    {
        Logger.LogDebug("Checking if game {} exists", gameId);
        return webSocketService.Games.Any(game => game.Id == gameId) ? Ok() : NotFound();
    }

    /// <summary>
    ///     Creates a new game and adds the specified player to it.
    /// </summary>
    /// <param name="data">The data required to create the game.</param>
    /// <returns>
    ///     Returns an <see cref="IActionResult" /> representing the result of the operation.
    ///     If the game is successfully created, returns a <see cref="CreatedResult" /> with the game details and a location
    ///     URL.
    ///     If there is an error during creation, returns a <see cref="BadRequestObjectResult" /> with the error message.
    /// </returns>
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

    /// <summary>
    ///     Runs the given WebSocketReceiveResult and byte array data to perform an action.
    /// </summary>
    /// <param name="result">The WebSocketReceiveResult object containing information about the received data.</param>
    /// <param name="data">The byte array data received from the WebSocket.</param>
    /// <returns>
    ///     Returns an ArraySegment object representing the action response in byte array format.
    /// </returns>
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

    /// <summary>
    ///     Sends the specified data segment.
    /// </summary>
    /// <param name="segment">The data segment to send.</param>
    protected override void Send(ArraySegment<byte> segment)
    {
        if (actionService.Game is not null)
            actionService.SendToAll(segment);
        else if (WebSocket is not null)
            webSocketService.Send(WebSocket, segment);
    }

    protected override ArraySegment<byte>? Disconnect() =>
        new ActionMessage { Action = GameAction.Disconnect, Data = actionService.Disconnect() }
            .ToArraySegment();

    protected override void SendDisconnectMessage(ArraySegment<byte> segment) => actionService.SendToAll(segment);

    /// <summary>
    ///     Performs the specified action based on the given message.
    /// </summary>
    /// <param name="message">The action message containing the action to be performed.</param>
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
