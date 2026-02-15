// Цей репозиторій відповідає за збереження та пошук географічних локацій (міст та адрес) у базі даних.
using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.Infrastructure.Repositories;

public class LocationRepository : ILocationRepository
{
    private readonly ApplicationDbContext _context;

    public LocationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Location?> GetByIdAsync(int id)
    {
        return await _context.Locations.FindAsync(id);
    }

    public async Task<Location?> GetByCityAndAddressAsync(string city, string address)
    {
        return await _context.Locations
            .FirstOrDefaultAsync(l => l.City.ToLower() == city.ToLower() && l.Address.ToLower() == address.ToLower());
    }

    public async Task<Location> AddAsync(Location location)
    {
        await _context.Locations.AddAsync(location);
        await _context.SaveChangesAsync();
        return location;
    }
}
