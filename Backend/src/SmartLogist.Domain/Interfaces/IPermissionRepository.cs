using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface IPermissionRepository
{
    Task<IEnumerable<Permission>> GetAllAsync();
    Task<Permission?> GetByIdAsync(int id);
    Task<IEnumerable<Permission>> GetByCategoryAsync(string category);
}
