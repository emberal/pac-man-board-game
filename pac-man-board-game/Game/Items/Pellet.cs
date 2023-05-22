using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Pellet : IPellet
{
    public PelletType Get { get; set; }
}