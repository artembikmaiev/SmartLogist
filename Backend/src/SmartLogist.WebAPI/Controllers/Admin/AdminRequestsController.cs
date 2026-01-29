using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.AdminRequest;
using SmartLogist.Application.Interfaces;
using System.Security.Claims;

namespace SmartLogist.WebAPI.Controllers.Admin;

[ApiController]
[Route("api/admin/requests")]
public class AdminRequestsController : ControllerBase
{
    private readonly IAdminRequestService _requestService;

    public AdminRequestsController(IAdminRequestService requestService)
    {
        _requestService = requestService;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
        {
            return userId;
        }
        
        return 1;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var requests = await _requestService.GetAllRequestsAsync();
            return Ok(requests);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        try
        {
            var requests = await _requestService.GetPendingRequestsAsync();
            return Ok(requests);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMy()
    {
        try
        {
            var userId = GetCurrentUserId();
            var requests = await _requestService.GetRequesterRequestsAsync(userId);
            return Ok(requests);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/process")]
    public async Task<IActionResult> Process(int id, [FromBody] ProcessRequestDto dto)
    {
        try
        {
            var adminId = GetCurrentUserId();
            await _requestService.ProcessRequestAsync(id, dto, adminId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("clear-processed")]
    public async Task<IActionResult> ClearProcessed()
    {
        try
        {
            await _requestService.ClearProcessedRequestsAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
