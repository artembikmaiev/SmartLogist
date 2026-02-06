using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface ICargoRepository
{
    Task<Cargo?> GetByIdAsync(int id);
    Task<Cargo> AddAsync(Cargo cargo);
}
