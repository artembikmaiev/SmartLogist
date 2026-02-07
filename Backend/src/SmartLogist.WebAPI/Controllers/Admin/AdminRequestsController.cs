using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.AdminRequest;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Enums;

namespace SmartLogist.WebAPI.Controllers.Admin;

// [Authorize(Roles = "Manager,Admin")]
[Route("api/admin/requests")]
public class AdminRequestsController : BaseApiController
{
    private readonly IAdminRequestService _requestService;

    public AdminRequestsController(IAdminRequestService requestService)
    {
        _requestService = requestService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _requestService.GetAllRequestsAsync();
        return Ok(requests);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var requests = await _requestService.GetPendingRequestsAsync();
        return Ok(requests);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMy()
    {
        var userId = GetUserId();
        var requests = await _requestService.GetRequesterRequestsAsync(userId);
        return Ok(requests);
    }

    [HttpPost("{id}/process")]
    public async Task<IActionResult> Process(int id, [FromBody] ProcessRequestDto dto)
    {
        var adminId = GetUserId();
        await _requestService.ProcessRequestAsync(id, dto, adminId);
        return NoContent();
    }

    [HttpDelete("clear-processed")]
    public async Task<IActionResult> ClearProcessed()
    {
        await _requestService.ClearProcessedRequestsAsync();
        return NoContent();
    }
}
