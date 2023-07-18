namespace pacMan.GameStuff.Items;

public interface IDiceCup
{
    List<int> Roll { get; }
}

public class DiceCup : IDiceCup
{
    private readonly List<Dice> _dices;

    public DiceCup() =>
        _dices = new List<Dice>
        {
            new(),
            new()
        };

    public List<int> Roll => _dices.Select(d => d.Roll).ToList();
}
