namespace pacMan.Game;

public class MovePath
{
    public Position[]? Path { get; set; }
    public required Position End { get; set; }
    public required Direction Direction { get; set; }
}

public class Position
{
    public int X { get; set; } = 0;
    public int Y { get; set; } = 0;
}

public enum Direction
{
    Left,
    Up,
    Right,
    Down
}

public class DirectionalPosition
{
    public required Position At { get; set; }
    public required Direction Direction { get; set; }
}