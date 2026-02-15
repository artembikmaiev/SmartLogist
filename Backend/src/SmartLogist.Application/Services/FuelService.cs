// Сервіс для моніторингу та надання інформації про ціни на різні типи палива.
using SmartLogist.Application.DTOs.External;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.Application.Services;

public class FuelService : IFuelService
{
    public Task<IEnumerable<FuelPriceDto>> GetFuelPricesAsync()
    {
        // Mocking real-time fuel prices for Ukraine (approximate current rates)
        var prices = new List<FuelPriceDto>
        {
            new FuelPriceDto { Type = "Diesel", Name = "Дизельна заправка", Price = 52.45m, Change = 0.15m },
            new FuelPriceDto { Type = "A95", Name = "Бензин А-95", Price = 54.30m, Change = -0.20m },
            new FuelPriceDto { Type = "LPG", Name = "Газ (LPG)", Price = 28.20m, Change = 0.05m }
        };

        return Task.FromResult<IEnumerable<FuelPriceDto>>(prices);
    }
}
