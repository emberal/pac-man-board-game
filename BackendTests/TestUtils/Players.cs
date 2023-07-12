using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;

namespace BackendTests.TestUtils;

public class Players
{
    internal static IPlayer Create(string colour) =>
        new Player
        {
            Name = colour,
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
            Name = player.Name,
            PacMan = player.PacMan
        };
}
