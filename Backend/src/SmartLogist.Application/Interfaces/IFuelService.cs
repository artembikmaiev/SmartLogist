// Інтерфейс сервісу для отримання та аналізу даних про ціни на пальне.
using SmartLogist.Application.DTOs.External;

namespace SmartLogist.Application.Interfaces;

public interface IFuelService
{
    Task<IEnumerable<FuelPriceDto>> GetFuelPricesAsync();
}
