using System.Net.WebSockets;
using System.Text.Json;
using pacMan.DTOs;
using pacMan.Exceptions;
using pacMan.GameStuff.Items;

namespace pacMan.Services;

public interface IActionService
{
    Player Player { set; }
    Game? Game { get; set; }
    WebSocket WebSocket { set; }
    List<int> RollDice();
    List<Player> FindGame(JsonElement? jsonElement);
    MovePlayerData HandleMoveCharacter(JsonElement? jsonElement);
    ReadyData Ready();
    string FindNextPlayer();
    List<Player> LeaveGame();
    void SendToAll(ArraySegment<byte> segment);
    List<Player>? Disconnect();
}

public class ActionService(ILogger logger, IGameService gameService) : IActionService
{
    public WebSocket WebSocket { private get; set; } = null!;

    public Game? Game { get; set; }

    public Player? Player { get; set; }

    public List<int> RollDice()
    {
        Game?.DiceCup.Roll();
        var rolls = Game?.DiceCup.Values ?? new List<int>();
        logger.LogInformation("Rolled [{}]", string.Join(", ", rolls));

        return rolls;
    }

    public MovePlayerData HandleMoveCharacter(JsonElement? jsonElement)
    {
        var data = jsonElement?.Deserialize<MovePlayerData>() ?? throw new NullReferenceException("Data is null");
        if (Game is not null)
        {
            Game.Ghosts = data.Ghosts;
            Game.Players = data.Players;
        }

        return data;
    }

    public List<Player> FindGame(JsonElement? jsonElement)
    {
        var (username, gameId) =
            jsonElement?.Deserialize<JoinGameData>() ?? throw new NullReferenceException("Data is null");

        var game = gameService.FindGameById(gameId) ??
                   throw new GameNotFoundException($"Game was not found, id \"{gameId}\" does not exist");

        var player = game.FindPlayerByUsername(username) ??
                     throw new PlayerNotFoundException($"Player \"{username}\" was not found in game");

        player.State = game.IsGameStarted ? State.InGame : State.WaitingForPlayers; // TODO doesn't work anymore
        Player = player;
        Game = game;
        // TODO send missing data: Dices, CurrentPlayer, Ghosts | Return Game instead?
        Game.Connections += SendSegment;
        return Game.Players;
    }

    public ReadyData Ready()
    {
        if (Player is null)
            throw new PlayerNotFoundException("Player not found, please create a new player");
        if (Game is null)
            throw new GameNotFoundException();

        var players = Game.SetReady(Player.Username).ToArray();
        // TODO roll to start
        Game.Shuffle();
        var allReady = players.All(p => p.State == State.Ready);
        if (allReady) Game.SetAllInGame();
        return new ReadyData { AllReady = allReady, Players = players };
    }

    public string FindNextPlayer() => Game?.NextPlayer().Username ?? throw new GameNotFoundException();

    public List<Player> LeaveGame()
    {
        if (Game is null) throw new NullReferenceException("Game is null");
        if (Player is null) throw new NullReferenceException("Player is null");
        Game.RemovePlayer(Player.Username);
        return Game.Players;
    }

    public List<Player>? Disconnect()
    {
        if (Player is null) return null;
        Player.State = State.Disconnected;
        if (Game is not null) Game.Connections -= SendSegment;
        return Game?.Players;
    }

    public void SendToAll(ArraySegment<byte> segment) => Game?.SendToAll(segment);

    private async Task SendSegment(ArraySegment<byte> segment) => await gameService.Send(WebSocket, segment);
}
