using pacMan.Game.Interfaces;

namespace pacMan.Game.Items;

public class Player : IPlayer
{
    public required IBox Box { get; init; }
}