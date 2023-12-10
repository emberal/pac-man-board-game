using System.Text.Json.Serialization;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.DTOs;

public readonly record struct JoinGameData(
    [property: JsonInclude, JsonPropertyName("username"), JsonRequired]
    string Username,
    [property: JsonInclude, JsonPropertyName("gameId"), JsonRequired]
    Guid GameId
)
{
    public void Deconstruct(out string username, out Guid gameId) => (username, gameId) = (Username, GameId);
}

public readonly record struct CreateGameData(
    [property: JsonInclude, JsonPropertyName("player"), JsonRequired]
    Player Player,
    [property: JsonInclude, JsonPropertyName("spawns"), JsonRequired]
    Queue<DirectionalPosition> Spawns
);

public readonly record struct ReadyData(
    [property: JsonInclude, JsonPropertyName("allReady"), JsonRequired]
    bool AllReady,
    [property: JsonInclude, JsonPropertyName("players"), JsonRequired]
    IEnumerable<Player> Players
);

public readonly record struct MovePlayerData(
    [property: JsonInclude, JsonPropertyName("players"), JsonRequired]
    List<Player> Players,
    [property: JsonInclude, JsonPropertyName("ghosts"), JsonRequired]
    List<Character> Ghosts,
    [property: JsonInclude, JsonPropertyName("dice"), JsonRequired]
    List<int> Dice,
    [property: JsonInclude, JsonPropertyName("eatenPellets"), JsonRequired]
    List<Position> EatenPellets
);
