using System.Net.WebSockets;
using System.Text.Json;
using System.Text.Json.Serialization;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public interface IActionService
{
    Player Player { set; }
    Game Game { set; }
    WebSocket? WebSocket { set; }
    void DoAction(ActionMessage message);
    List<int> RollDice();
    List<Player> SetPlayerInfo(JsonElement? jsonElement);
    object? HandleMoveCharacter(JsonElement? jsonElement);
    object Ready();
    string FindNextPlayer();
    List<Player> LeaveGame();
    void SendToAll(ArraySegment<byte> segment);
    List<Player>? Disconnect();
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

    public WebSocket? WebSocket { private get; set; }

    public Game? Game { get; set; }

    public Player? Player { get; set; }

    public void DoAction(ActionMessage message)
    {
        message.Data = message.Action switch
        {
            GameAction.RollDice => RollDice(),
            GameAction.MoveCharacter => HandleMoveCharacter(message.Data),
            GameAction.PlayerInfo => SetPlayerInfo(message.Data),
            GameAction.Ready => Ready(),
            GameAction.NextPlayer => FindNextPlayer(),
            GameAction.Disconnect => LeaveGame(),
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

    public object? HandleMoveCharacter(JsonElement? jsonElement)
    {
        if (Game != null && jsonElement.HasValue)
        {
            Game.Ghosts = jsonElement.Value.GetProperty("ghosts").Deserialize<List<Character>>() ??
                          throw new JsonException("Ghosts is null");
            Game.Players = jsonElement.Value.GetProperty("players").Deserialize<List<Player>>() ??
                           throw new NullReferenceException("Players is null");
        }

        return jsonElement;
    }

    public List<Player> SetPlayerInfo(JsonElement? jsonElement) // TODO split up into two actions, join and create
    {
        var data = jsonElement?.Deserialize<PlayerInfoData>() ?? throw new NullReferenceException("Data is null");
        Player = data.Player;

        Game? game;
        if ((game = _gameService.FindGameByUsername(Player.Username)) != null)
        {
            var player = game.Players.Find(p => p.Username == Player.Username);
            if (player is null) throw new NullReferenceException("Player is null");

            player.State = game.IsGameStarted ? State.InGame : State.WaitingForPlayers; // TODO doesn't work anymore
            Player = player;
            Game = game;
            // TODO send missing data: Dices, CurrentPlayer, Ghosts
        }
        else
        {
            Game = _gameService.CreateAndJoin(Player, data.Spawns);
        }

        Game.Connections += SendSegment;

        return Game.Players;
    }

    public object Ready()
    {
        object data;
        if (Player != null && Game != null)
        {
            var players = Game.SetReady(Player.Username).ToArray();
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

    public List<Player> LeaveGame()
    {
        if (Game == null || Player == null) throw new NullReferenceException("Game or Player is null");
        Game.RemovePlayer(Player.Username);
        return Game.Players;
    }

    public List<Player>? Disconnect()
    {
        if (Player == null) return null;
        Player.State = State.Disconnected;
        if (Game != null) Game.Connections -= SendSegment;
        return Game?.Players;
    }

    public void SendToAll(ArraySegment<byte> segment) => Game?.SendToAll(segment);

    private async Task SendSegment(ArraySegment<byte> segment)
    {
        if (WebSocket != null) await _gameService.Send(WebSocket, segment);
        else await Task.FromCanceled(new CancellationToken(true));
    }
}

public struct PlayerInfoData
{
    [JsonInclude]
    [JsonPropertyName("player")]
    public required Player Player { get; init; }

    [JsonInclude]
    [JsonPropertyName("spawns")]
    public required Queue<DirectionalPosition> Spawns { get; init; }
}

public struct ReadyData
{
    [JsonInclude]
    [JsonPropertyName("allReady")]
    public required bool AllReady { get; init; }

    [JsonInclude]
    [JsonPropertyName("players")]
    public required IEnumerable<Player> Players { get; set; }
}
