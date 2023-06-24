using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Player : IPlayer
{
    public required string Name { get; init; }
    public required Character PacMan { get; init; }
    public required string Colour { get; init; }
    public required Box Box { get; init; }
}