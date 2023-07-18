namespace pacMan.GameStuff;

public class MovePath : IEquatable<MovePath>
{
    public Position[]? Path { get; set; }
    public required Position End { get; init; }
    public required Direction Direction { get; init; }

    public bool Equals(MovePath? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Equals(Path, other.Path) && End.Equals(other.End) && Direction == other.Direction;
    }

    public static implicit operator MovePath(DirectionalPosition path) =>
        new()
        {
            End = path.At,
            Direction = path.Direction
        };

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((MovePath)obj);
    }

    public override int GetHashCode() => HashCode.Combine(Path, End, (int)Direction);
}

public class Position : IEquatable<Position>
{
    public int X { get; init; }
    public int Y { get; init; }

    public bool Equals(Position? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return X == other.X && Y == other.Y;
    }

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((Position)obj);
    }

    public override int GetHashCode() => HashCode.Combine(X, Y);
}

public enum Direction
{
    Left,
    Up,
    Right,
    Down
}

public class DirectionalPosition : IEquatable<DirectionalPosition>
{
    public required Position At { get; init; }
    public required Direction Direction { get; init; }

    public bool Equals(DirectionalPosition? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return At.Equals(other.At) && Direction == other.Direction;
    }

    public static explicit operator DirectionalPosition(MovePath path) =>
        new()
        {
            At = path.End,
            Direction = path.Direction
        };

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((DirectionalPosition)obj);
    }

    public override int GetHashCode() => HashCode.Combine(At, (int)Direction);
}
