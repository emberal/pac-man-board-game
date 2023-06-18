using System.Net.WebSockets;
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
    private readonly IPlayer _player; // TODO recieve player from client and choose a starter

    public GameController(ILogger<GameController> logger, IWebSocketService wsService) : base(logger, wsService)
    {
        _diceCup = new DiceCup();
        _player = new Player
        {
            Box = new Box()
        };
    }

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
            case GameAction.AppendBox:
                // TODO
                // Add pellets to box
                // Forward box to all clients
                break;
            default:
                Logger.Log(LogLevel.Information, "Forwarding message to all clients");
                break;
        }
    }
}