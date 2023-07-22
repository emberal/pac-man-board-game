using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace BackendTests.TestUtils;

internal static class Players
{
    internal static Player Create(string colour) =>
        new()
        {
            Username = colour,
            Colour = colour,
            PacMan = CreatePacMan(colour),
            Box = CreateBox(colour)
        };

    internal static Character CreatePacMan(string colour) =>
        new()
        {
            Colour = colour,
            Type = CharacterType.PacMan
        };

    internal static Box CreateBox(string colour) =>
        new()
        {
            Colour = colour
        };

    internal static Player Clone(this Player player) =>
        new()
        {
            Box = player.Box,
            Colour = player.Colour,
            Username = player.Username,
            PacMan = player.PacMan
        };
}
