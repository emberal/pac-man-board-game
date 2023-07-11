using pacMan.Exceptions;
using pacMan.Game;
using pacMan.Game.Interfaces;
using pacMan.Game.Items;
using pacMan.Services;
using pacMan.Utils;

namespace BackendTests.Services;

public class GameGroupTests
{
    private IPlayer _bluePlayer = null!;
    private GameGroup _gameGroup = null!;
    private IPlayer _greenPlayer = null!;
    private IPlayer _purplePlayer = null!;
    private IPlayer _redPlayer = null!;
    private IPlayer _yellowPlayer = null!;

    [SetUp]
    public void Setup()
    {
        _gameGroup = new GameGroup();
        const string redColour = "red";
        _redPlayer = new Player
        {
            Name = "Red",
            Colour = redColour,
            PacMan = CreatePacMan(redColour),
            Box = CreateBox(redColour)
        };
        const string blueColour = "blue";
        _bluePlayer = new Player
        {
            Name = "Blue",
            Colour = blueColour,
            PacMan = CreatePacMan(blueColour),
            Box = CreateBox(blueColour)
        };
        const string yellowColour = "yellow";
        _yellowPlayer = new Player
        {
            Name = "Yellow",
            Colour = yellowColour,
            PacMan = CreatePacMan(yellowColour),
            Box = CreateBox(yellowColour)
        };
        const string greenColour = "green";
        _greenPlayer = new Player
        {
            Name = "Green",
            Colour = greenColour,
            PacMan = CreatePacMan(greenColour),
            Box = CreateBox(greenColour)
        };
        const string purpleColour = "purple";
        _purplePlayer = new Player
        {
            Name = "Purple",
            Colour = purpleColour,
            PacMan = CreatePacMan(purpleColour),
            Box = CreateBox(purpleColour)
        };
    }

    private static Character CreatePacMan(string colour) =>
        new()
        {
            Colour = colour,
            IsEatable = true,
            Type = CharacterType.PacMan
        };

    private static Box CreateBox(string colour) =>
        new()
        {
            Colour = colour,
            Pellets = new List<Pellet>()
        };

    private static IPlayer Clone(IPlayer player) =>
        new Player
        {
            Box = player.Box,
            Colour = player.Colour,
            Name = player.Name,
            PacMan = player.PacMan
        };

    private void AddFullParty()
    {
        _gameGroup.AddPlayer(_bluePlayer);
        _gameGroup.AddPlayer(_redPlayer);
        _gameGroup.AddPlayer(_yellowPlayer);
        _gameGroup.AddPlayer(_greenPlayer);
    }

    #region AddPlayer(IPlayer player)

    [Test]
    public void AddPlayer_WhenEmpty()
    {
        var added = _gameGroup.AddPlayer(_redPlayer);
        Assert.That(added, Is.True);
    }

    [Test]
    public void AddPlayer_WhenFull() =>
        Assert.Multiple(() =>
        {
            AddFullParty();
            Assert.That(_gameGroup.Players.Count, Is.EqualTo(Rules.MaxPlayers));
            Assert.That(_gameGroup.AddPlayer(_purplePlayer), Is.False);
        });

    [Test]
    public void AddPlayer_WhenNameExists()
    {
        var redClone = Clone(_redPlayer);
        _gameGroup.AddPlayer(_redPlayer);
        var added = _gameGroup.AddPlayer(redClone);
        Assert.That(added, Is.True);
    }

    [Test]
    public void AddPlayer_WhenStateIsNotWaitingForPlayers()
    {
        _redPlayer.State = State.InGame;
        _gameGroup.AddPlayer(_redPlayer);
        Assert.That(_redPlayer.State, Is.EqualTo(State.WaitingForPlayers));
    }

    #endregion

    #region Sendtoall(ArraySegment<byte> segment)

    [Test]
    public void SendToAll_WhenConnectionsIsNull()
    {
        Assert.DoesNotThrow(() => _gameGroup.SendToAll(new { }.ToArraySegment()));
    }

    [Test]
    public void SendToAll_WhenConnectionsIsNotNull()
    {
        var counter = 0;
        async Task Send(ArraySegment<byte> segment) => await Task.Run(() => counter++);

        _gameGroup.Connections += Send;
        _gameGroup.Connections += Send;

        _gameGroup.SendToAll(new { }.ToArraySegment());

        // TODO timeout after n amount of time
        while (counter < 2) { }

        Assert.That(counter, Is.EqualTo(2));
    }

    #endregion

    #region SetReady(IPlayer player)

    [Test]
    public void SetReady_ReturnsAllPlayers()
    {
        _gameGroup.AddPlayer(_redPlayer);
        _gameGroup.AddPlayer(_bluePlayer);

        var players = _gameGroup.SetReady(_redPlayer).ToList();

        Assert.Multiple(() =>
        {
            Assert.That(players, Has.Count.EqualTo(2));
            Assert.That(players, Does.Contain(_redPlayer));
            Assert.That(players, Does.Contain(_bluePlayer));
        });
    }

    [Test]
    public void SetReady_SetsStateToReady()
    {
        _gameGroup.AddPlayer(_redPlayer);

        Assert.That(_redPlayer.State, Is.Not.EqualTo(State.Ready));

        _gameGroup.SetReady(_redPlayer);

        Assert.That(_redPlayer.State, Is.EqualTo(State.Ready));
    }

    [Test]
    public void SetReady_WhenPlayerIsNotInPlayers()
    {
        Assert.Throws<PlayerNotFoundException>(() => _gameGroup.SetReady(_redPlayer));
    }

    #endregion

    #region SetAllIngame()

    [Test]
    public void SetAllInGame_SetsStateToInGame()
    {
        AddFullParty();
        _gameGroup.Players.ForEach(player => player.State = State.Ready);
        Assert.That(_gameGroup.Players, Has.All.Property(nameof(IPlayer.State)).EqualTo(State.Ready));

        var allInGame = _gameGroup.SetAllInGame();

        Assert.Multiple(() =>
        {
            Assert.That(allInGame, Is.True);
            Assert.That(_gameGroup.Players, Has.All.Property(nameof(IPlayer.State)).EqualTo(State.InGame));
        });
    }

    [Test]
    public void SetAllInGame_SetStateToInGame_WhenNotAllReady()
    {
        AddFullParty();
        var allInGame = _gameGroup.SetAllInGame();
        Assert.That(allInGame, Is.False);
    }

    [Test]
    public void SetAllInGame_WhenPlayersIsEmpty()
    {
        _gameGroup.SetAllInGame();
        Assert.That(_gameGroup.Players, Is.Empty);
    }

    #endregion
}
