using DAL.Database.Models;
using DAL.Database.Service;
using Microsoft.AspNetCore.Mvc;
using pacMan.GameStuff.Items;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayerController : ControllerBase
{
    private readonly UserService _userService;

    public PlayerController(UserService userService) => _userService = userService;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User user)
    {
        var result = await _userService.Login(user.Username, user.Password);
        if (result is null) return Unauthorized("Invalid username or password");
        return Ok((Player)result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User user) => throw new NotSupportedException();
}
