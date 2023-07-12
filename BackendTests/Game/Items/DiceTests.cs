using pacMan.Game.Items;

namespace BackendTests.Game.Items;

public class DiceTests
{
    [Test]
    public void Roll_ReturnsNumberBetween1And6()
    {
        var dice = new Dice();
        var roll = dice.Roll;
        Assert.That(roll, Is.GreaterThanOrEqualTo(1));
        Assert.That(roll, Is.LessThanOrEqualTo(6));
    }
}
