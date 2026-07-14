using DevToolkit.Application.DTOs;
using DevToolkit.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DevToolkit.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProxyController : ControllerBase
{
    private readonly IProxyService _proxyService;

    public ProxyController(IProxyService proxyService)
    {
        _proxyService = proxyService;
    }

    [HttpPost]
    public async Task<IActionResult> Execute([FromBody] ProxyRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Url))
            return BadRequest(new { error = "URL is required" });

        try
        {
            var result = await _proxyService.ExecuteAsync(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
