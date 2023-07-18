namespace pacMan.Exceptions;

public class GameNotPlayableException : Exception
{
    public GameNotPlayableException(string message = "Game is not allowed to be played") : base(message) { }
}
