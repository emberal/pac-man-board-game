using DAL.Database.Models;

namespace DAL.Database.Service;

public class UserService
{
    private readonly List<User> _users = new()
    {
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
    };

    public async Task<User?> Login(string username, string password)
    {
        return await Task.Run(() => _users.FirstOrDefault(x => x.Username == username && x.Password == password));
    }
}
