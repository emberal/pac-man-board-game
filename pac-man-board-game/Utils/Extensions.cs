using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace pacMan.Utils;

public static partial class Extensions
{
    /// <summary>
    ///     Converts the specified byte array into a string using UTF-8 encoding and then removes any invalid characters.
    /// </summary>
    /// <param name="bytes">The byte array to convert.</param>
    /// <param name="length">The number of bytes to decode.</param>
    /// <returns>The decoded string without any invalid characters.</returns>
    public static string GetString(this byte[] bytes, int length)
    {
        var s = Encoding.UTF8.GetString(bytes, 0, length);
        // Removes invalid characters from the string
        return InvalidCharacters().Replace(s, string.Empty);
    }

    /// <summary>
    ///     Converts an object to an <see cref="ArraySegment{T}" /> of bytes.
    /// </summary>
    /// <param name="obj">The object to convert.</param>
    /// <returns>An <see cref="ArraySegment{T}" /> of bytes representing the serialized object in UTF-8 encoding.</returns>
    public static ArraySegment<byte> ToArraySegment(this object obj)
    {
        var json = JsonSerializer.Serialize(obj);
        var bytes = Encoding.UTF8.GetBytes(json);
        return new ArraySegment<byte>(bytes, 0, json.Length);
    }

    /// <summary>
    ///     Retrieves a regular expression pattern that matches invalid characters.
    /// </summary>
    /// <returns>A regular expression pattern for matching invalid characters.</returns>
    [GeneratedRegex("\\p{C}+")]
    private static partial Regex InvalidCharacters();
}
