// Інтерфейс репозиторію для управління географічними локаціями в системі.
using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface ILocationRepository
{
    Task<Location?> GetByIdAsync(int id);
    Task<Location?> GetByCityAndAddressAsync(string city, string address);
    Task<Location> AddAsync(Location location);
}
