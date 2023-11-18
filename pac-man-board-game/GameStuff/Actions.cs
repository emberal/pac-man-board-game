using System.Text.Json;
using System.Text.Json.Serialization;

namespace pacMan.GameStuff;

public enum GameAction
{
    Error,
    RollDice,
    MoveCharacter,
    JoinGame,
    Ready,
    NextPlayer,
    Disconnect
}

public class ActionMessage<T>
{
    [JsonPropertyName("action")] public GameAction Action { get; init; }

    [JsonPropertyName("data")] public T? Data { get; set; }

    public static ActionMessage FromJson(string json) => JsonSerializer.Deserialize<ActionMessage>(json)!;
}

public class ActionMessage : ActionMessage<dynamic>;
