using pacMan.GameStuff.Items;

namespace BackendTests.Game.Items;

[TestFixture]
[TestOf(nameof(Dice))]
public class DiceTests
{
    [Test]
    public void Roll_ReturnsNumberBetween1And6()
    {
        var dice = new Dice();
        dice.Roll();
        var roll = dice.Value;
        Assert.That(roll, Is.GreaterThanOrEqualTo(1));
        Assert.That(roll, Is.LessThanOrEqualTo(6));
    }
}
