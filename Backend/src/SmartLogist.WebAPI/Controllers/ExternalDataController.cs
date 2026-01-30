using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/external")]
public class ExternalDataController : ControllerBase
{
    private readonly ICurrencyService _currencyService;
    private readonly IRoadConditionService _roadConditionService;

    public ExternalDataController(ICurrencyService currencyService, IRoadConditionService roadConditionService)
    {
        _currencyService = currencyService;
        _roadConditionService = roadConditionService;
    }

    [HttpGet("currency")]
    public async Task<IActionResult> GetCurrencyRates()
    {
        var rates = await _currencyService.GetExchangeRatesAsync();
        return Ok(rates);
    }

    [HttpGet("road-conditions")]
    public async Task<IActionResult> GetRoadConditions()
    {
        var conditions = await _roadConditionService.GetRoadConditionsAsync();
        return Ok(conditions);
    }
}
