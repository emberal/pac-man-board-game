using DAL.Database.Models;

namespace pacMan.GameStuff.Items;

public interface IPlayer
{
    string Username { get; init; }
    Character PacMan { get; init; }
    string Colour { get; init; }
    Box? Box { get; init; }
    State State { get; set; }
}

public enum State
{
    WaitingForPlayers,
    Ready,
    InGame,
    Disconnected
}

public class Player : IPlayer, IEquatable<Player>
{
    public bool Equals(Player? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Username == other.Username;
    }

    // [JsonPropertyName("username")]
    public required string Username { get; init; }
    public required Character PacMan { get; init; }
    public required string Colour { get; init; }
    public Box? Box { get; init; }
    public State State { get; set; } = State.WaitingForPlayers;

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((Player)obj);
    }

    public override int GetHashCode() => Username.GetHashCode();

    public static explicit operator Player(User user) =>
        new()
        {
            Username = user.Username,
            PacMan = new Character
            {
                Colour = user.Colour ?? "white",
                Type = CharacterType.PacMan
            },
            Colour = user.Colour ?? "white"
        };
}
