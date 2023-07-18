namespace pacMan.Exceptions;

public class GameNotFoundException : Exception
{
    public GameNotFoundException(string message = "Game not found") : base(message) { }
}
