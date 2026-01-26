using System.Net.Http.Json;
using SmartLogist.Application.DTOs.External;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.Application.Services;

public class CurrencyService : ICurrencyService
{
    private readonly HttpClient _httpClient;
    private const string NbuApiUrl = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

    public CurrencyService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<CurrencyDto>> GetExchangeRatesAsync()
    {
        try
        {
            var allRates = await _httpClient.GetFromJsonAsync<List<NbuCurrencyResponse>>(NbuApiUrl);
            
            if (allRates == null) return Enumerable.Empty<CurrencyDto>();

            // Фільтруємо USD та EUR
            var targetCodes = new[] { "USD", "EUR" };
            
            return allRates
                .Where(r => targetCodes.Contains(r.Cc))
                .Select(r => new CurrencyDto
                {
                    Code = r.Cc,
                    Name = r.Txt,
                    Rate = r.Rate,
                    Date = r.Exchangedate
                });
        }
        catch (Exception)
        {
            // Повертаємо пустий список у разі помилки API
            return Enumerable.Empty<CurrencyDto>();
        }
    }

    // Внутрішній клас для десеріалізації відповіді НБУ
    private class NbuCurrencyResponse
    {
        public string Txt { get; set; } = string.Empty;
        public double Rate { get; set; }
        public string Cc { get; set; } = string.Empty;
        public string Exchangedate { get; set; } = string.Empty;
    }
}
