using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace pacMan.Utils;

public static partial class Extensions
{
    public static string GetString(this byte[] bytes, int length)
    {
        var s = Encoding.UTF8.GetString(bytes, 0, length);
        // Removes invalid characters from the string
        return InvalidCharacters().Replace(s, "");
    }

    public static ArraySegment<byte> ToArraySegment(this object obj)
    {
        var json = JsonSerializer.Serialize(obj);
        var bytes = Encoding.UTF8.GetBytes(json);
        return new ArraySegment<byte>(bytes, 0, json.Length);
    }

    [GeneratedRegex("\\p{C}+")]
    private static partial Regex InvalidCharacters();
}
