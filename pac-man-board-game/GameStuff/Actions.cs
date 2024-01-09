using System.Text.Json;
using System.Text.Json.Serialization;

namespace pacMan.GameStuff;

/// <summary>
///     Represents various actions that can be performed in a game.
/// </summary>
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

/// <summary>
///     Represents an action message with optional data of type <typeparamref name="T" />.
///     Every Action may have a different type of data, or no data at all.
/// </summary>
/// <typeparam name="T">The type of the data.</typeparam>
public class ActionMessage<T>
{
    [JsonPropertyName("action")] public GameAction Action { get; init; }

    [JsonPropertyName("data")] public T? Data { get; set; }

    /// <summary>
    ///     Parses a JSON string into an ActionMessage object. With dynamic data.
    /// </summary>
    /// <param name="json">The JSON string to deserialize.</param>
    /// <returns>An ActionMessage object populated with the deserialized data.</returns>
    public static ActionMessage FromJson(string json) => JsonSerializer.Deserialize<ActionMessage>(json)!;
}

public class ActionMessage : ActionMessage<dynamic>;
