// Інтерфейс сервісу для доступу до курсів валют та фінансових розрахунків.
using SmartLogist.Application.DTOs.External;

namespace SmartLogist.Application.Interfaces;

public interface ICurrencyService
{
    Task<IEnumerable<CurrencyDto>> GetExchangeRatesAsync();
}
