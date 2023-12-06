using DAL.Database.Models;

namespace DAL.Database.Service;

public class UserService
{
    private readonly List<User> _users =
    [
        new User
        {
            Username = "Firefox",
            Password = "Firefox",
            Colour = "red"
        },
        new User
        {
            Username = "Chrome",
            Password = "Chrome",
            Colour = "blue"
        }
    ];

    public Task<User?> Login(string username, string password)
    {
        return Task.Run(() => _users.FirstOrDefault(x => x.Username == username && x.Password == password));
    }
}
