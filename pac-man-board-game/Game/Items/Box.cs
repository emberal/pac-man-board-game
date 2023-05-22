using System.Collections;
using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Box : IBox
{
    private readonly IList<IPellet> _pellets = new List<IPellet>();
    
    public int CountNormal => _pellets.Count(pellet => pellet.Get == PelletType.Normal);

    public void Add(IPellet pellet) => _pellets.Add(pellet);

    public IEnumerator<IPellet> GetEnumerator() => _pellets.GetEnumerator();

    IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
}