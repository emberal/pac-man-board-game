using System.Text.Json.Serialization;

namespace pacMan.GameStuff.Items;

public class Box : IEquatable<Box>
{
    [JsonInclude]
    [JsonPropertyName("pellets")]
    public int Pellets { get; init; }

    [JsonInclude]
    [JsonPropertyName("powerPellets")]
    public int PowerPellet { get; init; }

    [JsonInclude]
    [JsonPropertyName("colour")]
    public required string Colour { get; init; }

    public bool Equals(Box? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Pellets == other.Pellets && PowerPellet == other.PowerPellet && Colour == other.Colour;
    }

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((Box)obj);
    }

    public override int GetHashCode() => HashCode.Combine(Pellets, PowerPellet, Colour);
}
