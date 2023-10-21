using System.Text.Json.Serialization;
using DAL.Database.Models;

namespace pacMan.GameStuff.Items;

public enum State
{
    WaitingForPlayers,
    Ready,
    InGame,
    Disconnected
}

public class Player : IEquatable<Player>, ICloneable
{
    [JsonPropertyName("username")] public required string Username { get; init; }

    [JsonPropertyName("pacMan")] public required Character PacMan { get; set; }

    [JsonPropertyName("colour")] public required string Colour { get; init; }

    [JsonPropertyName("box")] public Box? Box { get; set; }

    [JsonPropertyName("state")] public State State { get; set; } = State.WaitingForPlayers;

    public object Clone() =>
        new Player
        {
            Username = Username, Colour = Colour, PacMan = PacMan, Box = Box, State = State
        };

    public bool Equals(Player? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Username == other.Username;
    }

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
