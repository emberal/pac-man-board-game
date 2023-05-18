using System.Text;
using System.Text.Json;

namespace pacMan.Utils;

public static class Extensions
{
    public static string GetString(this byte[] bytes, int length)
    {
        return Encoding.UTF8.GetString(bytes, 0, length);
    }

    public static ArraySegment<byte> ToArraySegment(this object obj)
    {
        var json = JsonSerializer.Serialize(obj);
        var bytes = Encoding.UTF8.GetBytes(json);
        return new ArraySegment<byte>(bytes, 0, json.Length);
    }
}