using pacMan.GameStuff;
using pacMan.GameStuff.Items;

namespace DAL.Database.Service;

public class UserService
{
    private readonly List<Player> _users = new()
    {
        new Player
        {
            Username = "admin",
            Colour = "red",
            PacMan = new Character
            {
                Colour = "red",
                Type = CharacterType.PacMan
            }
        }
    };

    public async Task<IPlayer?> Login(string username, string password)
    {
        return await Task.Run(() => _users.FirstOrDefault(x => x.Username == username && password == "admin"));
    }
}
