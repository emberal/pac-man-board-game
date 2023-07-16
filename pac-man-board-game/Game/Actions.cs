using System.Text.Json;

namespace pacMan.Game;

public enum GameAction
{
    RollDice,
    MoveCharacter,
    PlayerInfo,
    Ready,
    NextPlayer
}

public class ActionMessage<T>
{
    public GameAction Action { get; init; }
    public T? Data { get; set; }

    public static ActionMessage FromJson(string json) => JsonSerializer.Deserialize<ActionMessage>(json)!;
}

public class ActionMessage : ActionMessage<dynamic> { }
