using pacMan.Game.Items;

namespace pacMan.Game.Interfaces;

public interface IBox : IEnumerable<IPellet>
{
    int CountNormal { get; }
    void Add(Pellet pellet);
}