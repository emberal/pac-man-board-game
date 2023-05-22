namespace pacMan.Game.Interfaces;

public enum PelletType
{
    Normal,
    PowerPellet
}

public interface IPellet
{
    PelletType Get { get; set; }
}