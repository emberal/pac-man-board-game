using System.Text.Json;
using Microsoft.CSharp.RuntimeBinder;
using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Interfaces;

namespace pacMan.Services;

public interface IActionService
{
    void DoAction(ActionMessage message);
    List<int> RollDice();
    List<IPlayer> PlayerInfo(ActionMessage message);
    object Ready();
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
            GameAction.RollDice => RollDice(),
            GameAction.PlayerInfo => PlayerInfo(message),
            GameAction.Ready => Ready(),
            _ => message.Data
        };
    }

    public List<int> RollDice()
    {
        var rolls = _diceCup.Roll();
        _logger.Log(LogLevel.Information, "Rolled [{}]", string.Join(", ", rolls));

        return rolls;
    }

    public List<IPlayer> PlayerInfo(ActionMessage message)
    {
        try
        {
            _player = JsonSerializer.Deserialize<Player>(message.Data);
            _group = _wsService.AddPlayer(_player);
        }
        catch (RuntimeBinderException e)
        {
            Console.WriteLine(e);
            if (message.Data == null) throw new NullReferenceException();

            throw;
        }

        return _group.Players;
    }

    public object Ready()
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
