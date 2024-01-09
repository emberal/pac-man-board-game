using System.Text.Json.Serialization;

namespace pacMan.GameStuff;

public class Character : IEquatable<Character>
{
    [JsonPropertyName("colour")] public required string Colour { get; init; }

    [JsonPropertyName("position")] public MovePath? Position { get; set; }

    [JsonInclude]
    [JsonPropertyName("isEatable")]
    public bool IsEatable { get; set; } = true;

    [JsonPropertyName("spawnPosition")] public DirectionalPosition? SpawnPosition { get; set; }

    [JsonPropertyName("type")] public required CharacterType? Type { get; init; }

    public bool Equals(Character? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Colour == other.Colour && Equals(Position, other.Position) && IsEatable == other.IsEatable &&
               Equals(SpawnPosition, other.SpawnPosition) && Type == other.Type;
    }

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((Character)obj);
    }

    public override int GetHashCode() => HashCode.Combine(Colour, Type);
}

/// <summary>
///     Represents the types of characters in a game.
/// </summary>
public enum CharacterType
{
    PacMan,
    Ghost,
    Dummy
}
