using pacMan.Game.Items;

namespace pacMan.Game.Interfaces;

public interface IPlayer
{
    string Name { get; init; }
    Character PacMan { get; init; }
    string Colour { get; init; }
    Box Box { get; init; }
}