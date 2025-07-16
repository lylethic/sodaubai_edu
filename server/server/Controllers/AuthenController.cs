using Microsoft.AspNetCore.Mvc;

namespace server.Controllers;

[Produces("application/json")]
[Route("api/[controller]")]
[ApiExplorerSettings(IgnoreApi = true)]
public class AuthenController : Controller
{
    [HttpGet]
    public IActionResult NotAuthorized()
    {
        return Unauthorized();
    }
}
