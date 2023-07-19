using System.Text.Json;
using System.Text.Json.Serialization;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public interface IActionService
{
    IPlayer Player { set; }
    Game Game { set; }
    void DoAction(ActionMessage message);
    List<int> RollDice();
    List<IPlayer> SetPlayerInfo(JsonElement? jsonElement);
    object? HandleMoveCharacter(JsonElement? jsonElement); // TODO test
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

    public Game? Game { get; set; }

    public IPlayer? Player { get; set; }

    public void DoAction(ActionMessage message)
    {
        message.Data = message.Action switch
        {
            GameAction.RollDice => RollDice(),
            GameAction.PlayerInfo => SetPlayerInfo(message.Data),
            GameAction.Ready => Ready(),
            GameAction.NextPlayer => FindNextPlayer(),
            GameAction.MoveCharacter => HandleMoveCharacter(message.Data),
            _ => message.Data
        };
    }

    public List<int> RollDice()
    {
        Game?.DiceCup.Roll();
        var rolls = Game?.DiceCup.Values ?? new List<int>();
        _logger.Log(LogLevel.Information, "Rolled [{}]", string.Join(", ", rolls));

        return rolls;
    }

    public List<IPlayer> SetPlayerInfo(JsonElement? jsonElement)
    {
        var data = jsonElement?.Deserialize<PlayerInfoData>() ?? throw new NullReferenceException("Data is null");
        Player = data.Player;

        Game? group;
        IPlayer? player;
        if ((group = _gameService.FindGameByUsername(Player.Username)) != null &&
            (player = group.Players.Find(p => p.Username == Player.Username))?.State == State.Disconnected)
        {
            player.State = group.IsGameStarted ? State.InGame : State.WaitingForPlayers;
            Player = player;
            Game = group;
            // TODO send missing data: Dices, CurrentPlayer, Ghosts
        }
        else
        {
            Game = _gameService.AddPlayer(Player, data.Spawns);
        }

        return Game.Players;
    }

    public object Ready()
    {
        object data;
        if (Player != null && Game != null)
        {
            var players = Game.SetReady(Player).ToArray();
            // TODO roll to start
            Game.Shuffle();
            var allReady = players.All(p => p.State == State.Ready);
            if (allReady) Game.SetAllInGame();
            data = new ReadyData { AllReady = allReady, Players = players };
        }
        else
        {
            data = "Player not found, please create a new player";
        }

        return data;
    }

    public string FindNextPlayer() => Game?.NextPlayer().Username ?? "Error: No group found";

    public void Disconnect()
    {
        if (Player != null) Player.State = State.Disconnected;
    }

    public object? HandleMoveCharacter(JsonElement? jsonElement)
    {
        if (Game != null && jsonElement.HasValue)
            Game.Ghosts = jsonElement.Value.GetProperty("Ghosts").Deserialize<List<Character>>() ??
                          throw new JsonException("Ghosts is null");

        return jsonElement;
    }
}

public struct PlayerInfoData
{
    [JsonInclude] public required Player Player { get; init; }
    [JsonInclude] public required Queue<DirectionalPosition> Spawns { get; init; }
}

public struct ReadyData
{
    [JsonInclude] public required bool AllReady { get; init; }
    [JsonInclude] public required IEnumerable<IPlayer> Players { get; set; }
}
