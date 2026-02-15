using System.Net.Http.Json;
using SmartLogist.Application.DTOs.External;
using SmartLogist.Application.Interfaces;
// Сервіс для взаємодії з API курсів валют та надання актуальних фінансових даних.
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace SmartLogist.Application.Services;

public class CurrencyService : ICurrencyService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<CurrencyService> _logger;
    private const string NbuApiUrl = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

    public CurrencyService(HttpClient httpClient, ILogger<CurrencyService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<IEnumerable<CurrencyDto>> GetExchangeRatesAsync()
    {
        try
        {
            // Поточний курс (може бути на завтра після 16:00)
            var currentRates = await _httpClient.GetFromJsonAsync<List<NbuCurrencyResponse>>(NbuApiUrl);
            if (currentRates == null) return Enumerable.Empty<CurrencyDto>();

            // Отримуємо курс на вчора для розрахунку зміни
            var yesterday = DateTime.Today.AddDays(-1).ToString("yyyyMMdd");
            var yesterdayUrl = $"{NbuApiUrl}&date={yesterday}";
            var oldRates = await _httpClient.GetFromJsonAsync<List<NbuCurrencyResponse>>(yesterdayUrl);
            
            var targetCodes = new[] { "USD", "EUR" };
            var result = new List<CurrencyDto>();

            foreach (var code in targetCodes)
            {
                var current = currentRates.FirstOrDefault(r => r.Cc == code);
                if (current == null) continue;

                var previous = oldRates?.FirstOrDefault(r => r.Cc == code);
                var change = previous != null ? current.Rate - previous.Rate : 0;

                result.Add(new CurrencyDto
                {
                    Code = current.Cc,
                    Name = current.Txt,
                    Rate = current.Rate,
                    Change = change,
                    Date = current.Exchangedate
                });
            }

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching currency rates from NBU");
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
