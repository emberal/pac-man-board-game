using System.Text.Json.Serialization;

namespace pacMan.GameStuff;

/// <summary>
///     Represents a move path consisting of a sequence of positions and a target end position with a specified direction.
/// </summary>
public class MovePath : IEquatable<MovePath>
{
    [JsonInclude]
    [JsonPropertyName("path")]
    public Position[]? Path { get; set; }

    [JsonPropertyName("end")] public required Position End { get; init; }

    [JsonPropertyName("direction")] public required Direction Direction { get; init; }

    public bool Equals(MovePath? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Equals(Path, other.Path) && End.Equals(other.End) && Direction == other.Direction;
    }

    /// <summary>
    ///     Converts a DirectionalPosition object to a MovePath object.
    /// </summary>
    /// <param name="path">The DirectionalPosition object to convert.</param>
    /// <returns>A MovePath object with the same End and Direction as the DirectionalPosition object.</returns>
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

    public override int GetHashCode() => HashCode.Combine(End, (int)Direction);
}

/// <summary>
///     Represents a position with x and y coordinates.
/// </summary>
public class Position : IEquatable<Position>
{
    [JsonPropertyName("x")] public int X { get; init; }

    [JsonPropertyName("y")] public int Y { get; init; }

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

/// <summary>
///     Enum representing the possible directions: Left, Up, Right, and Down.
/// </summary>
public enum Direction
{
    Left,
    Up,
    Right,
    Down
}

/// <summary>
///     Represents a directional position with a coordinate and a direction.
/// </summary>
public class DirectionalPosition : IEquatable<DirectionalPosition>
{
    [JsonPropertyName("at")] public required Position At { get; init; }

    [JsonPropertyName("direction")] public required Direction Direction { get; init; }

    public bool Equals(DirectionalPosition? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return At.Equals(other.At) && Direction == other.Direction;
    }

    /// <summary>
    ///     Converts a MovePath object to a DirectionalPosition object.
    /// </summary>
    /// <param name="path">The MovePath object to convert.</param>
    /// <returns>A DirectionalPosition object representing the converted MovePath object.</returns>
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
