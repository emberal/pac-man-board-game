using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace BackendTests.TestUtils;

internal static class Players
{
    internal static IPlayer Create(string colour) =>
        new Player
        {
            UserName = colour,
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
            Colour = colour,
            Pellets = new List<Pellet>()
        };

    internal static IPlayer Clone(IPlayer player) =>
        new Player
        {
            Box = player.Box,
            Colour = player.Colour,
            UserName = player.UserName,
            PacMan = player.PacMan
        };
}
