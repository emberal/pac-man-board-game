namespace pacMan.GameStuff;

public class Character : IEquatable<Character>
{
    public required string Colour { get; init; }
    public MovePath? Position { get; set; }
    public bool IsEatable { get; set; } = true;
    public DirectionalPosition? SpawnPosition { get; set; }
    public required CharacterType? Type { get; init; }

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

    public override int GetHashCode() => HashCode.Combine(Colour, Position, IsEatable, SpawnPosition, (int)Type);
}

public enum CharacterType
{
    PacMan,
    Ghost,
    Dummy
}
