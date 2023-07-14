namespace pacMan.Game.Items;

public interface IPlayer
{
    string Name { get; init; }
    Character PacMan { get; init; }
    string Colour { get; init; }
    Box? Box { get; init; }
    State State { get; set; }
}

public enum State
{
    WaitingForPlayers,
    Ready,
    InGame
}

public class Player : IPlayer, IEquatable<Player>
{
    public bool Equals(Player? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return Name == other.Name && PacMan.Equals(other.PacMan) && Colour == other.Colour && Box.Equals(other.Box) &&
               State == other.State;
    }

    public required string Name { get; init; }
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

    public override int GetHashCode() => HashCode.Combine(Name, PacMan, Colour, Box, (int)State);
}
