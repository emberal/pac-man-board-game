using DAL.Database.Models;
using DAL.Database.Service;
using Microsoft.AspNetCore.Mvc;
using pacMan.GameStuff.Items;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class PlayerController(UserService userService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        var result = await userService.Login(user.Username, user.Password);
        if (result is null) return Unauthorized("Invalid username or password");
        return Ok((Player)result);
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] User user) => throw new NotSupportedException();
}
