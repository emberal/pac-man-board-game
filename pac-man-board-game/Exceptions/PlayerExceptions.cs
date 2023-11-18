namespace pacMan.Exceptions;

public class PlayerNotFoundException(string? message = "Player not found") : Exception(message);
