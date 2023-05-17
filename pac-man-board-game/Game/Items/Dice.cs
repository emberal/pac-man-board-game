using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Dice : IDice
{
    private readonly Random _random = new();
    
    public int Roll() => _random.Next(1, 7);
}