using DAL.Database.Models;
using DAL.Database.Service;
using Microsoft.AspNetCore.Mvc;
using pacMan.GameStuff.Items;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class PlayerController(UserService userService) : ControllerBase
{
    /// <summary>
    ///     Logs in a user.
    /// </summary>
    /// <param name="user">The user object containing the username and password.</param>
    /// <returns>Returns an IActionResult indicating the login result.</returns>
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        var result = await userService.Login(user.Username, user.Password);
        if (result is null) return Unauthorized("Invalid username or password");
        return Ok((Player)result);
    }

    [HttpPost]
    public Task<IActionResult> Register([FromBody] User user) => throw new NotSupportedException();
}
