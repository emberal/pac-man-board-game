using BackendTests.TestUtils;
using pacMan.Exceptions;
using pacMan.Game;
using pacMan.Game.Interfaces;
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
        _redPlayer = Players.Create("red");
        _bluePlayer = Players.Create("blue");
        _yellowPlayer = Players.Create("yellow");
        _greenPlayer = Players.Create("green");
        _purplePlayer = Players.Create("purple");
    }

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
        var redClone = Players.Clone(_redPlayer);
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
