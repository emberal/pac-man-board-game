namespace pacMan.Game;

public class Character
{
    public required string Colour { get; set; }
    public MovePath? Position { get; set; }
    public required bool IsEatable { get; set; }
    public DirectionalPosition? SpawnPosition { get; set; }
    public required CharacterType Type { get; set; }
}

public enum CharacterType
{
    PacMan,
    Ghost,
    Dummy
}