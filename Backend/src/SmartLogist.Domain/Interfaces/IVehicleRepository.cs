using SmartLogist.Domain.Entities;

namespace SmartLogist.Domain.Interfaces;

public interface IVehicleRepository
{
    Task<Vehicle?> GetByIdAsync(int id);
    Task<IEnumerable<Vehicle>> GetAllAsync();
    Task<Vehicle> AddAsync(Vehicle vehicle);
    Task UpdateAsync(Vehicle vehicle);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(string licensePlate);
    Task<IEnumerable<Vehicle>> GetVehiclesWithDriversAsync();
    Task AssignVehicleToDriverAsync(int vehicleId, int driverId, bool isPrimary);
    Task UnassignVehicleFromDriverAsync(int vehicleId, int driverId);
    Task UpdateMileageAsync(int vehicleId, float additionalMileage);
}
