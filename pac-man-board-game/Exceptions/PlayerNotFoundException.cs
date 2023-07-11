namespace pacMan.Exceptions;

public class PlayerNotFoundException : Exception
{
    public PlayerNotFoundException(string? message = "Player not found") : base(message) { }
}
