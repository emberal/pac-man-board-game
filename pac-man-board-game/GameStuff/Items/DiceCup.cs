using System.Text.Json.Serialization;

namespace pacMan.GameStuff.Items;

public class DiceCup
{
    private readonly List<Dice> _dices;

    public DiceCup() =>
        _dices = new List<Dice>
        {
            new(),
            new()
        };

    [JsonInclude] public List<int> Values => _dices.Select(dice => dice.Value).ToList();

    public void Roll() => _dices.ForEach(dice => dice.Roll());
}
