using Microsoft.AspNetCore.Mvc;

namespace pacMan.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WsController : ControllerBase
{
    [HttpGet]
    public void TestGet()
    {
        // TODO test websocket https://learn.microsoft.com/en-us/aspnet/core/fundamentals/websockets?view=aspnetcore-7.0
    }
}