using System.Text.Json.Serialization;

namespace pacMan.GameStuff.Items;

public class Dice
{
    private readonly Random _random = new();

    /// <summary>
    ///     Represents the value of the previous roll.
    /// </summary>
    [JsonInclude]
    public int Value { get; private set; }

    /// <summary>
    ///     Rolls a dice by generating a random number between 1 and 6 and assigns it to the 'Value' property of the dice.
    /// </summary>
    public void Roll() => Value = _random.Next(1, 7);
}
