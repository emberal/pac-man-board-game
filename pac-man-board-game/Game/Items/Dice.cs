namespace pacMan.Game.Items;

public interface IDice
{
    int Roll { get; }
}

public class Dice : IDice
{
    private readonly Random _random = new();

    public int Roll => _random.Next(1, 7);
}
