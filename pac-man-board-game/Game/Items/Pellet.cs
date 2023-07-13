namespace pacMan.Game.Items;

public interface IPellet
{
    bool IsPowerPellet { get; init; }
}

public class Pellet : IPellet, IEquatable<Pellet>
{
    public bool Equals(Pellet? other)
    {
        if (ReferenceEquals(null, other)) return false;
        if (ReferenceEquals(this, other)) return true;
        return IsPowerPellet == other.IsPowerPellet;
    }

    public bool IsPowerPellet { get; init; }

    public override bool Equals(object? obj)
    {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        return obj.GetType() == GetType() && Equals((Pellet)obj);
    }

    public override int GetHashCode() => IsPowerPellet.GetHashCode();
}
