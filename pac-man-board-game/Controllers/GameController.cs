using System.Net.WebSockets;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using pacMan.Game;
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
    public override async Task Accept()
    {
        await base.Accept();
    }

    protected override ArraySegment<byte> Run(WebSocketReceiveResult result, byte[] data)
    {
        var stringResult = data.GetString(result.Count);

        Logger.Log(LogLevel.Information, "Received: {}", stringResult);
        var action = ActionMessage.FromJson(stringResult);

        DoAction(action);
        return action.ToArraySegment();
    }

    private void DoAction(ActionMessage message)
    {
        switch (message.Action)
        {
            case GameAction.RollDice:
                var rolls = _diceCup.Roll();
                Logger.Log(LogLevel.Information, "Rolled [{}]", string.Join(", ", rolls));

                message.Data = rolls;
                break;
            case GameAction.PlayerInfo:
                Player player = JsonSerializer.Deserialize<Player>(message.Data);
                var group = WsService.AddPlayer(player); // TODO missing some data?

                message.Data = group.Players;
                break;
            case GameAction.Ready:
                // TODO select starter player
                break;
            default:
                Logger.Log(LogLevel.Information, "Forwarding message to all clients");
                break;
        }
    }
}