using SmartLogist.Application.DTOs.External;

namespace SmartLogist.Application.Interfaces;

public interface ICurrencyService
{
    Task<IEnumerable<CurrencyDto>> GetExchangeRatesAsync();
}
