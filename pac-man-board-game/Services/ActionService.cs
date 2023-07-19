using System.Text.Json;
using Microsoft.CSharp.RuntimeBinder;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public interface IActionService
{
    IPlayer Player { set; }
    Game Group { set; }
    void DoAction(ActionMessage message);
    List<int> RollDice();
    List<IPlayer> SetPlayerInfo(ActionMessage message);
    object Ready();
    string FindNextPlayer();
    void Disconnect();
}

public class ActionService : IActionService
{
    private readonly GameService _gameService;
    private readonly ILogger<ActionService> _logger;

    public ActionService(ILogger<ActionService> logger, GameService gameService)
    {
        _logger = logger;
        _gameService = gameService;
    }

    public Game? Group { get; set; }

    public IPlayer? Player { get; set; }

    public void DoAction(ActionMessage message)
    {
        message.Data = message.Action switch
        {
            GameAction.RollDice => RollDice(),
            GameAction.PlayerInfo => SetPlayerInfo(message),
            GameAction.Ready => Ready(),
            GameAction.NextPlayer => FindNextPlayer(),
            _ => message.Data
        };
    }

    public List<int> RollDice()
    {
        Group?.DiceCup.Roll();
        var rolls = Group?.DiceCup.Values ?? new List<int>();
        _logger.Log(LogLevel.Information, "Rolled [{}]", string.Join(", ", rolls));

        return rolls;
    }

    public List<IPlayer> SetPlayerInfo(ActionMessage message)
    {
        try
        {
            // Receieving JsonElement from frontend
            PlayerInfoData data = JsonSerializer.Deserialize<PlayerInfoData>(message.Data);
            Player = data.Player;

            Game? group;
            IPlayer? player;
            if ((group = _gameService.FindGameByUsername(Player.UserName)) != null &&
                (player = group.Players.Find(p => p.UserName == Player.UserName))?.State == State.Disconnected)
            {
                player.State = group.IsGameStarted ? State.InGame : State.WaitingForPlayers;
                Player = player;
                Group = group;
                // TODO send missing data: Dices, CurrentPlayer, Ghosts
            }
            else
            {
                Group = _gameService.AddPlayer(Player, data.Spawns);
            }
        }
        catch (RuntimeBinderException e)
        {
            Console.WriteLine(e);
            if (message.Data is null) throw new NullReferenceException();

            throw;
        }

        return Group.Players;
    }

    public object Ready()
    {
        object data;
        if (Player != null && Group != null)
        {
            var players = Group.SetReady(Player).ToArray();
            // TODO roll to start
            Group.Shuffle();
            var allReady = players.All(p => p.State == State.Ready);
            if (allReady) Group.SetAllInGame();
            data = new ReadyData { AllReady = allReady, Players = players };
        }
        else
        {
            data = "Player not found, please create a new player";
        }

        return data;
    }

    public string FindNextPlayer() => Group?.NextPlayer().UserName ?? "Error: No group found";

    public void Disconnect()
    {
        if (Player != null) Player.State = State.Disconnected;
    }
}

public struct PlayerInfoData
{
    public required Player Player { get; set; }
    public required Queue<DirectionalPosition> Spawns { get; set; }
}

public struct ReadyData
{
    public required bool AllReady { get; init; }
    public required IEnumerable<IPlayer> Players { get; set; }
}
