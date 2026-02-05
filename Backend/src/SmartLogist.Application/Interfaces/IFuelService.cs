using SmartLogist.Application.DTOs.External;

namespace SmartLogist.Application.Interfaces;

public interface IFuelService
{
    Task<IEnumerable<FuelPriceDto>> GetFuelPricesAsync();
}
