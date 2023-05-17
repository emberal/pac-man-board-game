using System.Text;

namespace pacMan.Utils;

public static class Extensions
{
    public static string GetString(this byte[] bytes, int length)
    {
        return Encoding.UTF8.GetString(bytes, 0, length);
    }
}