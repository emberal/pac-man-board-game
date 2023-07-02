using System.Net.WebSockets;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Interfaces;
using pacMan.Services;
using pacMan.Utils;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GameController : GenericController
{
    private readonly IDiceCup _diceCup;
    private GameGroup _group = new();
    private IPlayer? _player;

    public GameController(ILogger<GameController> logger, IWebSocketService wsService) : base(logger, wsService) =>
        _diceCup = new DiceCup();

    [HttpGet]
    public override async Task Accept() => await base.Accept();

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
                _player = JsonSerializer.Deserialize<Player>(message.Data);
                _group = WsService.AddPlayer(_player); // TODO missing some data?

                message.Data = _group.Players;
                break;
            case GameAction.Ready:
                if (_player != null)
                {
                    var players = _group.SetReady(_player).ToArray();
                    if (players.All(p => p.State == State.Ready))
                        // TODO roll to start
                        message.Data = new { AllReady = true, Starter = _group.RandomPlayer };
                    else
                        message.Data = new { AllReady = false, players };
                }
                else
                {
                    message.Data = "Player not found, please create a new player";
                }

                break;
            default:
                Logger.Log(LogLevel.Information, "Forwarding message to all clients");
                break;
        }
    }
}
