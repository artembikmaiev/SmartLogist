// Цей репозиторій керує даними про типи та характеристики вантажів, що перевозяться.
using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.Infrastructure.Repositories;

public class CargoRepository : ICargoRepository
{
    private readonly ApplicationDbContext _context;

    public CargoRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Cargo?> GetByIdAsync(int id)
    {
        return await _context.Cargos.FindAsync(id);
    }

    public async Task<Cargo> AddAsync(Cargo cargo)
    {
        await _context.Cargos.AddAsync(cargo);
        await _context.SaveChangesAsync();
        return cargo;
    }
}
