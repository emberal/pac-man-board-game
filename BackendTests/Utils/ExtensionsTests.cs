using System.Text.Json;
using pacMan.Utils;

namespace BackendTests.Utils;

[TestFixture]
[TestOf(nameof(Extensions))]
public class ExtensionsTests
{
    [SetUp]
    public void Setup()
    {
        _bytes = "Hello World!"u8.ToArray();
    }

    [Test]
    public void ToArraySegmentValidObject()
    {
        var obj = new { Test = "test" };
        var segment = obj.ToArraySegment();

        Assert.That(JsonSerializer.Serialize(obj), Has.Length.EqualTo(segment.Count));
    }

    [Test]
    public void ToArraySegmentNullableObject()
    {
        string? s = null;
        var segment = s!.ToArraySegment(); // Segment contains: null
        Assert.That(segment, Has.Count.EqualTo(4));
    }

    private byte[] _bytes = null!;

    [Test]
    public void GetString_ValidByteArray()
    {
        Assert.That(_bytes.GetString(_bytes.Length), Is.EqualTo("Hello World!"));
    }

    [Test]
    public void GetString_EmptyByteArray()
    {
        Assert.That(new byte[] { }.GetString(0), Is.EqualTo(""));
    }

    [Test]
    public void GetString_NegativeLength()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => _bytes.GetString(-1));
    }

    [Test]
    public void GetString_LengthGreaterThanByteArrayLength()
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => _bytes.GetString(_bytes.Length + 1));
    }

    [Test]
    public void GetString_LengthShorterThanByteArrayLength()
    {
        Assert.That(_bytes.GetString(_bytes.Length / 2), Is.EqualTo("Hello "));
    }
}
