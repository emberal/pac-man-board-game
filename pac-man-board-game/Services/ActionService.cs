using System.Text.Json;
using Microsoft.CSharp.RuntimeBinder;
using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Interfaces;

namespace pacMan.Services;

public interface IActionService
{
    IPlayer Player { get; set; }
    GameGroup Group { get; set; }
    void DoAction(ActionMessage message);
    List<int> RollDice();
    List<IPlayer> SetPlayerInfo(ActionMessage message);
    object Ready();
}

public class ActionService : IActionService // TODO tests
{
    private readonly IDiceCup _diceCup;
    private readonly ILogger<ActionService> _logger;
    private readonly IWebSocketService _wsService;

    public ActionService(ILogger<ActionService> logger, IWebSocketService wsService)
    {
        _logger = logger;
        _diceCup = new DiceCup();
        _wsService = wsService;
    }

    public GameGroup Group { get; set; } = new();

    public IPlayer? Player { get; set; }

    public void DoAction(ActionMessage message)
    {
        message.Data = message.Action switch
        {
            GameAction.RollDice => RollDice(),
            GameAction.PlayerInfo => SetPlayerInfo(message),
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

    public List<IPlayer> SetPlayerInfo(ActionMessage message)
    {
        try
        {
            // Receieved JsonElement from frontend
            Player = JsonSerializer.Deserialize<Player>(message.Data);
            Group = _wsService.AddPlayer(Player);
        }
        catch (RuntimeBinderException e)
        {
            Console.WriteLine(e);
            if (message.Data == null) throw new NullReferenceException();

            throw;
        }

        return Group.Players;
    }

    public object Ready()
    {
        object data;
        if (Player != null)
        {
            var players = Group.SetReady(Player).ToArray();
            if (players.All(p => p.State == State.Ready))
            {
                // TODO roll to start
                Group.SetAllInGame();
                data = new { AllReady = true, Players = players, Starter = Group.RandomPlayer };
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
