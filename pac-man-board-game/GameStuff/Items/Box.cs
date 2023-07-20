using System.Text.Json.Serialization;

namespace pacMan.GameStuff.Items;

public class Box : IEquatable<Box>
{
    [JsonPropertyName("pellets")] public List<Pellet>? Pellets { get; init; } = new();

    [JsonPropertyName("colour")] public required string Colour { get; init; }

    public int CountNormal => Pellets?.Count(pellet => !pellet.IsPowerPellet) ?? 0;

    public bool Equals(Box? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return (Equals(Pellets, other.Pellets) || (Pellets?.Count == 0 && other.Pellets?.Count == 0)) &&
               Colour == other.Colour;
    }

    public void Add(Pellet pellet)
    {
        Pellets?.Add(pellet);
    }

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((Box)obj);
    }

    public override int GetHashCode() => HashCode.Combine(Pellets, Colour);
}
