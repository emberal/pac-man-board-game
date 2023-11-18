namespace pacMan.Exceptions;

public class GameNotFoundException(string message = "Game not found") : Exception(message);

public class GameNotPlayableException(string message = "Game is not allowed to be played") : Exception(message);
