using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.DTOs.External;
using SmartLogist.Application.Interfaces;
using System.Globalization;

namespace SmartLogist.WebAPI.Controllers;

// [Authorize]
public class RoadsController : BaseApiController
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
        var culture = CultureInfo.InvariantCulture;
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

    [HttpGet("conditions")]
    public async Task<IActionResult> GetConditions()
    {
        var conditions = await _roadConditionService.GetRoadConditionsAsync();
        return Ok(conditions);
    }
}
