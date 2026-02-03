using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.External;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoadsController : ControllerBase
{
    private readonly IRoutingService _routingService;
    private readonly IRoadConditionService _roadConditionService;

    public RoadsController(IRoutingService routingService, IRoadConditionService roadConditionService)
    {
        _routingService = routingService;
        _roadConditionService = roadConditionService;
    }

    [HttpGet("route")]
    public async Task<IActionResult> GetRoute(
        [FromQuery] string startLat, 
        [FromQuery] string startLng, 
        [FromQuery] string endLat, 
        [FromQuery] string endLng,
        [FromQuery] double? height = null,
        [FromQuery] double? width = null,
        [FromQuery] double? length = null,
        [FromQuery] double? weight = null,
        [FromQuery] bool? isHazardous = null)
    {
        try
        {
            var culture = System.Globalization.CultureInfo.InvariantCulture;
            var origin = new RoutePoint 
            { 
                Latitude = double.Parse(startLat.Replace(',', '.'), culture), 
                Longitude = double.Parse(startLng.Replace(',', '.'), culture) 
            };
            var destination = new RoutePoint 
            { 
                Latitude = double.Parse(endLat.Replace(',', '.'), culture), 
                Longitude = double.Parse(endLng.Replace(',', '.'), culture) 
            };
            
            var result = await _routingService.GetRouteAsync(origin, destination, height, width, length, weight, isHazardous);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"RoadsController Error: {ex.Message}");
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpGet("conditions")]
    public async Task<IActionResult> GetConditions()
    {
        try
        {
            var conditions = await _roadConditionService.GetRoadConditionsAsync();
            return Ok(conditions);
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}
