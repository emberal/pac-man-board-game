namespace pacMan.Game;

public enum GameAction
{
    RollDice
}

public class ActionMessage<T>
{
    public GameAction Action { get; set; }
    public T? Data { get; set; }
}

public class ActionMessage : ActionMessage<dynamic>
{
}