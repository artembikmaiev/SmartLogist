using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.WebAPI.Controllers;

[Authorize]
public class ExternalDataController : BaseApiController
{
    private readonly ICurrencyService _currencyService;
    private readonly IRoadConditionService _roadConditionService;
    private readonly IFuelService _fuelService;

    public ExternalDataController(ICurrencyService currencyService, IRoadConditionService roadConditionService, IFuelService fuelService)
    {
        _currencyService = currencyService;
        _roadConditionService = roadConditionService;
        _fuelService = fuelService;
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

    [HttpGet("fuel")]
    public async Task<IActionResult> GetFuelPrices()
    {
        var prices = await _fuelService.GetFuelPricesAsync();
        return Ok(prices);
    }
}
