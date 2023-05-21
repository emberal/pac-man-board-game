using System.Text.Json;

namespace pacMan.Game;

public enum GameAction
{
    RollDice,
    MoveCharacter,
}

public class ActionMessage<T>
{
    public GameAction Action { get; set; }
    public T? Data { get; set; }

    public static ActionMessage FromJson(string json) => JsonSerializer.Deserialize<ActionMessage>(json)!;
}

public class ActionMessage : ActionMessage<dynamic>
{
}