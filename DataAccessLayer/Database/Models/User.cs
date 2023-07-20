namespace DAL.Database.Models;

public class User
{
    public required string Username { get; init; }
    public required string Password { get; init; } // TODO use hashing and salt
    public string? Colour { get; init; }
}
