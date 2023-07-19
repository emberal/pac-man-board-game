using System.Text.Json.Serialization;

namespace pacMan.GameStuff.Items;

public class Dice
{
    private readonly Random _random = new();

    [JsonInclude] public int Value { get; private set; }

    public void Roll() => Value = _random.Next(1, 7);
}
