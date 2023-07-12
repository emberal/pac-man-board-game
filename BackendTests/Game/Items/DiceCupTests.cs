using pacMan.Game.Items;

namespace BackendTests.Game.Items;

public class DiceCupTests
{
    [Test]
    public void Roll_ReturnsTwoElements()
    {
        var diceCup = new DiceCup();
        var roll = diceCup.Roll;
        Assert.That(roll, Has.Count.EqualTo(2));
    }
    
    [Test]
    public void Roll_ReturnsNumbersInRange1To6()
    {
        var diceCup = new DiceCup();
        var roll = diceCup.Roll;
        Assert.That(roll[0], Is.GreaterThanOrEqualTo(1));
        Assert.That(roll[0], Is.LessThanOrEqualTo(6));
        Assert.That(roll[1], Is.GreaterThanOrEqualTo(1));
        Assert.That(roll[1], Is.LessThanOrEqualTo(6));
    }
}
