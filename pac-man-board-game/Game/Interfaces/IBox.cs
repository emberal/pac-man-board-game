namespace pacMan.Game.Interfaces;

public interface IBox : IEnumerable<IOrb>
{
    void Add(IOrb orb);
}