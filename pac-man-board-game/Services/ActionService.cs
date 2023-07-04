using System.Text.Json;
using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Interfaces;

namespace pacMan.Services;

public interface IActionService
{
    void DoAction(ActionMessage message);
    List<int> RollDice(ActionMessage message);
    List<IPlayer> PlayerInfo(ActionMessage message);
    object Ready(ActionMessage message);
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
        message.Data = message.Action switch
        {
            GameAction.RollDice => RollDice(message),

            GameAction.PlayerInfo => PlayerInfo(message),
            GameAction.Ready => Ready(message),
            _ => message.Data
        };
    }

    public List<int> RollDice(ActionMessage message)
    {
        var rolls = _diceCup.Roll();
        _logger.Log(LogLevel.Information, "Rolled [{}]", string.Join(", ", rolls));

        return rolls;
    }

    public List<IPlayer> PlayerInfo(ActionMessage message)
    {
        _player = JsonSerializer.Deserialize<Player>(message.Data);
        _group = _wsService.AddPlayer(_player); // TODO missing some data?

        return _group.Players;
    }

    public object Ready(ActionMessage message)
    {
        object data;
        if (_player != null)
        {
            var players = _group.SetReady(_player).ToArray();
            if (players.All(p => p.State == State.Ready))
            {
                // TODO roll to start
                _group.SetAllInGame();
                data = new { AllReady = true, Players = players, Starter = _group.RandomPlayer };
            }
            else
            {
                data = new { AllReady = false, Players = players };
            }
        }
        else
        {
            data = "Player not found, please create a new player";
        }

        return data;
    }
}
