using System.Text.Json;
using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Interfaces;

namespace pacMan.Services;

public interface IActionService
{
    void DoAction(ActionMessage message);
    void RollDice(ActionMessage message);
    void PlayerInfo(ActionMessage message);
    void Ready(ActionMessage message);
}

public class ActionService : IActionService // TODO tests
{
    private readonly IDiceCup _diceCup;
    private readonly ILogger<ActionService> _logger;
    private readonly IWebSocketService _wsService;

    private GameGroup _group = new();
    private IPlayer? _player;

    public ActionService(ILogger<ActionService> logger, IWebSocketService wsService)
    {
        _logger = logger;
        _diceCup = new DiceCup();
        _wsService = wsService;
    }

    public void DoAction(ActionMessage message)
    {
        switch (message.Action)
        {
            case GameAction.RollDice:
                RollDice(message);
                break;
            case GameAction.PlayerInfo:
                PlayerInfo(message);
                break;
            case GameAction.Ready:
                Ready(message);
                break;
            case GameAction.MoveCharacter:
            default:
                _logger.Log(LogLevel.Information, "Forwarding message to all clients");
                break;
        }
    }

    public void RollDice(ActionMessage message)
    {
        var rolls = _diceCup.Roll();
        _logger.Log(LogLevel.Information, "Rolled [{}]", string.Join(", ", rolls));

        message.Data = rolls;
    }

    public void PlayerInfo(ActionMessage message)
    {
        _player = JsonSerializer.Deserialize<Player>(message.Data);
        _group = _wsService.AddPlayer(_player); // TODO missing some data?

        message.Data = _group.Players;
    }

    public void Ready(ActionMessage message)
    {
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
    }
}
