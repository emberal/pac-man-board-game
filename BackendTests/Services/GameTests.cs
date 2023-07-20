using BackendTests.TestUtils;
using pacMan.Exceptions;
using pacMan.GameStuff;
using pacMan.GameStuff.Items;
using pacMan.Utils;

namespace BackendTests.Services;

public class GameTests
{
    private readonly DirectionalPosition _spawn3By3Up = new()
        { At = new Position { X = 3, Y = 3 }, Direction = Direction.Up };

    private readonly DirectionalPosition _spawn7By7Down = new()
        { At = new Position { X = 7, Y = 7 }, Direction = Direction.Down };

    private readonly DirectionalPosition _spawn7By7Left = new()
        { At = new Position { X = 7, Y = 7 }, Direction = Direction.Left };

    private readonly DirectionalPosition _spawn7By7Right = new()
        { At = new Position { X = 7, Y = 7 }, Direction = Direction.Right };

    private Player _bluePlayer = null!;
    private pacMan.Services.Game _game = null!;
    private Player _greenPlayer = null!;
    private Player _purplePlayer = null!;
    private Player _redPlayer = null!;

    private Queue<DirectionalPosition> _spawns = null!;
    private Player _yellowPlayer = null!;

    [SetUp]
    public void Setup()
    {
        _spawns = new Queue<DirectionalPosition>(
            new[] { _spawn3By3Up, _spawn7By7Left, _spawn7By7Down, _spawn7By7Right });

        _game = new pacMan.Services.Game(_spawns);
        _redPlayer = Players.Create("red");
        _bluePlayer = Players.Create("blue");
        _yellowPlayer = Players.Create("yellow");
        _greenPlayer = Players.Create("green");
        _purplePlayer = Players.Create("purple");
    }

    private void AddFullParty()
    {
        _game.AddPlayer(_bluePlayer);
        _game.AddPlayer(_redPlayer);
        _game.AddPlayer(_yellowPlayer);
        _game.AddPlayer(_greenPlayer);
    }

    #region NextPlayer()

    [Test]
    public void NextPlayer_WhenEmpty()
    {
        Assert.Throws<InvalidOperationException>(() => _game.NextPlayer());
    }

    #endregion

    #region AddPlayer(Player player)

    [Test]
    public void AddPlayer_WhenEmpty()
    {
        var added = _game.AddPlayer(_redPlayer);
        Assert.That(added, Is.True);
    }

    [Test]
    public void AddPlayer_WhenFull() =>
        Assert.Multiple(() =>
        {
            AddFullParty();
            Assert.That(_game.Players.Count, Is.EqualTo(Rules.MaxPlayers));
            Assert.That(_game.AddPlayer(_purplePlayer), Is.False);
        });

    [Test]
    public void AddPlayer_WhenNameExists()
    {
        var redClone = _redPlayer.Clone();
        _game.AddPlayer(_redPlayer);
        var added = _game.AddPlayer(redClone);
        Assert.That(added, Is.True);
    }

    [Test]
    public void AddPlayer_WhenStateIsNotWaitingForPlayers()
    {
        _redPlayer.State = State.InGame;
        _game.AddPlayer(_redPlayer);
        Assert.That(_redPlayer.State, Is.EqualTo(State.WaitingForPlayers));
    }

    [Test]
    public void AddPlayer_AddSpawnPosition()
    {
        _game.AddPlayer(_redPlayer);
        Assert.That(_redPlayer.PacMan.SpawnPosition, Is.Not.Null);
        Assert.That(_redPlayer.PacMan.SpawnPosition, Is.EqualTo(_spawn3By3Up));
    }

    [Test]
    public void AddPlayer_WhenGameHasStarted()
    {
        _game.AddPlayer(_redPlayer);
        _game.AddPlayer(_bluePlayer);

        _game.SetReady(_redPlayer.Username);
        _game.SetReady(_bluePlayer.Username);
        _game.SetAllInGame();

        Assert.That(_game.AddPlayer(_greenPlayer), Is.False);
    }

    #endregion

    #region Sendtoall(ArraySegment<byte> segment)

    [Test]
    public void SendToAll_WhenConnectionsIsNull()
    {
        Assert.DoesNotThrow(() => _game.SendToAll(new { }.ToArraySegment()));
    }

    [Test]
    public void SendToAll_WhenConnectionsIsNotNull()
    {
        var counter = 0;
        async Task Send(ArraySegment<byte> segment) => await Task.Run(() => counter++);

        _game.Connections += Send;
        _game.Connections += Send;

        _game.SendToAll(new { }.ToArraySegment());

        // TODO timeout after n amount of time
        while (counter < 2) { }

        Assert.That(counter, Is.EqualTo(2));
    }

    #endregion

    #region SetReady(Player player)

    [Test]
    public void SetReady_ReturnsAllPlayers()
    {
        _game.AddPlayer(_redPlayer);
        _game.AddPlayer(_bluePlayer);

        var players = _game.SetReady(_redPlayer.Username).ToList();

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
        _game.AddPlayer(_redPlayer);

        Assert.That(_redPlayer.State, Is.Not.EqualTo(State.Ready));

        _game.SetReady(_redPlayer.Username);

        Assert.That(_redPlayer.State, Is.EqualTo(State.Ready));
    }

    [Test]
    public void SetReady_WhenPlayerIsNotInPlayers()
    {
        Assert.Throws<PlayerNotFoundException>(() => _game.SetReady(_redPlayer.Username));
    }

    #endregion

    #region SetAllIngame()

    [Test]
    public void SetAllInGame_SetsStateToInGame()
    {
        AddFullParty();
        _game.Players.ForEach(player => player.State = State.Ready);
        Assert.That(_game.Players, Has.All.Property(nameof(Player.State)).EqualTo(State.Ready));

        var allInGame = _game.SetAllInGame();

        Assert.Multiple(() =>
        {
            Assert.That(allInGame, Is.True);
            Assert.That(_game.Players, Has.All.Property(nameof(Player.State)).EqualTo(State.InGame));
        });
    }

    [Test]
    public void SetAllInGame_SetStateToInGame_WhenNotAllReady()
    {
        AddFullParty();
        var allInGame = _game.SetAllInGame();
        Assert.That(allInGame, Is.False);
    }

    [Test]
    public void SetAllInGame_WhenPlayersIsEmpty()
    {
        _game.SetAllInGame();
        Assert.That(_game.Players, Is.Empty);
    }

    #endregion

    #region IsGameStarted()

    [Test]
    public void IsGameStarted_AllWaiting()
    {
        AddFullParty();
        Assert.That(_game.IsGameStarted, Is.False);
    }

    [Test]
    public void IsGameStarted_AllInGame()
    {
        AddFullParty();
        _game.Players.ForEach(player => player.State = State.InGame);
        Assert.That(_game.IsGameStarted, Is.True);
    }

    #endregion
}