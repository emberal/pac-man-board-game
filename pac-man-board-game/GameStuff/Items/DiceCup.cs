using System.Text.Json.Serialization;

namespace pacMan.GameStuff.Items;

/// <summary>
///     Represents a cup containing multiple dice.
/// </summary>
public class DiceCup
{
    private readonly List<Dice> _dices = [new Dice(), new Dice()];

    /// <summary>
    ///     Gets a list of integer values representing the values of the dices.
    /// </summary>
    /// <value>
    ///     A list of integer values representing the values of the dices.
    /// </value>
    [JsonInclude]
    public List<int> Values => _dices.Select(dice => dice.Value).ToList();

    /// <summary>
    ///     Rolls all the dice in the list.
    /// </summary>
    public void Roll() => _dices.ForEach(dice => dice.Roll());
}
