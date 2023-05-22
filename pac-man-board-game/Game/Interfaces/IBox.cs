namespace pacMan.Game.Interfaces;

public interface IBox : IEnumerable<IPellet>
{
    void Add(IPellet pellet);
    
    int CountNormal { get; }
}