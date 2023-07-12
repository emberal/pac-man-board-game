using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Box : IEquatable<Box>
{
    public required List<Pellet>? Pellets { get; init; } = new();
    public required string Colour { get; init; }

    public int CountNormal => Pellets?.Count(pellet => !pellet.IsPowerPellet) ?? 0;

    public bool Equals(Box? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return (Equals(Pellets, other.Pellets) || (Pellets?.Count == 0 && other.Pellets?.Count == 0)) &&
               Colour == other.Colour;
    }

    public IEnumerator<IPellet> GetEnumerator() => Pellets?.GetEnumerator() ?? new List<Pellet>.Enumerator();

    // IEnumerator IEnumerable.GetEnumerator()
    // {
    //     return GetEnumerator();
    // }

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
