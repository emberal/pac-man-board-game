using System.Text.Json.Serialization;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace pacMan.DTOs;

public readonly record struct JoinGameData(
    [property: JsonInclude]
    [property: JsonPropertyName("username")]
    string Username,
    [property: JsonInclude]
    [property: JsonPropertyName("gameId")]
    Guid GameId
)
{
    public void Deconstruct(out string username, out Guid gameId) => (username, gameId) = (Username, GameId);
}

public readonly record struct CreateGameData(
    [property: JsonInclude]
    [property: JsonPropertyName("player")]
    Player Player,
    [property: JsonInclude]
    [property: JsonPropertyName("spawns")]
    Queue<DirectionalPosition> Spawns
);

public readonly record struct ReadyData(
    [property: JsonInclude]
    [property: JsonPropertyName("allReady")]
    bool AllReady,
    [property: JsonInclude]
    [property: JsonPropertyName("players")]
    IEnumerable<Player> Players
);

public readonly record struct MovePlayerData(
    [property: JsonInclude]
    [property: JsonPropertyName("players")]
    List<Player> Players,
    [property: JsonInclude]
    [property: JsonPropertyName("ghosts")]
    List<Character> Ghosts,
    [property: JsonInclude]
    [property: JsonPropertyName("dice")]
    List<int> Dice,
    [property: JsonInclude]
    [property: JsonPropertyName("eatenPellets")]
    List<Position> EatenPellets
);
