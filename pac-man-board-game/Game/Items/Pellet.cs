using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Pellet : IPellet
{
    public bool IsPowerPellet { get; init; }
}