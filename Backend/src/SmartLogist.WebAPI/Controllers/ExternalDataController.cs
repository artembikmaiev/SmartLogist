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

    public ExternalDataController(ICurrencyService currencyService)
    {
        _currencyService = currencyService;
    }

    [HttpGet("currency")]
    public async Task<IActionResult> GetCurrencyRates()
    {
        var rates = await _currencyService.GetExchangeRatesAsync();
        return Ok(rates);
    }
}
