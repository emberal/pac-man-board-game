using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Box
{
    public required List<Pellet>? Pellets { get; init; } = new();
    public required string Colour { get; init; }

    public int CountNormal => Pellets?.Count(pellet => !pellet.IsPowerPellet) ?? 0;

    public IEnumerator<IPellet> GetEnumerator()
    {
        return Pellets?.GetEnumerator() ?? new List<Pellet>.Enumerator();
    }

    // IEnumerator IEnumerable.GetEnumerator()
    // {
    //     return GetEnumerator();
    // }

    public void Add(Pellet pellet)
    {
        Pellets?.Add(pellet);
    }
}