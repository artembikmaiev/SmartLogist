// Цей репозиторій забезпечує доступ до даних про транспортні засоби та їхнє закріплення за водіями в базі даних.
// Репозиторій для управління даними про транспортні засоби, їх технічний стан та доступність.
using Microsoft.EntityFrameworkCore;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Interfaces;
using SmartLogist.Infrastructure.Data;

namespace SmartLogist.Infrastructure.Repositories;

public class VehicleRepository : IVehicleRepository
{
    private readonly ApplicationDbContext _context;

    public VehicleRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Vehicle?> GetByIdAsync(int id)
    {
        return await _context.Vehicles
            .Include(v => v.AssignedDrivers)
                .ThenInclude(dv => dv.Driver)
            .FirstOrDefaultAsync(v => v.Id == id);
    }

    public async Task<IEnumerable<Vehicle>> GetAllAsync()
    {
        return await _context.Vehicles
            .Include(v => v.AssignedDrivers)
                .ThenInclude(dv => dv.Driver)
            .OrderByDescending(v => v.CreatedAt)
            .ToListAsync();
    }

    public async Task<Vehicle> AddAsync(Vehicle vehicle)
    {
        await _context.Vehicles.AddAsync(vehicle);
        await _context.SaveChangesAsync();
        return vehicle;
    }

    public async Task UpdateAsync(Vehicle vehicle)
    {
        _context.Vehicles.Update(vehicle);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        // 1. Вручну обнуліть VehicleId у рейсах, щоб уникнути порушень обмежень зовнішнього ключа
        // оскільки схема БД може не мати ON DELETE SET NULL для всіх партицій правильно налаштованим
        await _context.Trips
            .Where(t => t.VehicleId == id)
            .ExecuteUpdateAsync(s => s.SetProperty(t => t.VehicleId, (int?)null));

        // 2. Видалити транспортний засіб
        var vehicle = await _context.Vehicles.FindAsync(id);
        if (vehicle != null)
        {
            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsAsync(string licensePlate)
    {
        return await _context.Vehicles.AnyAsync(v => v.LicensePlate == licensePlate);
    }

    public async Task<IEnumerable<Vehicle>> GetVehiclesWithDriversAsync()
    {
        return await _context.Vehicles
            .Include(v => v.AssignedDrivers)
                .ThenInclude(dv => dv.Driver)
            .ToListAsync();
    }

    public async Task AssignVehicleToDriverAsync(int vehicleId, int driverId, bool isPrimary)
    {
        // 1. Якщо встановлюється новий основний транспортний засіб для водія, 
        // скасовуються інші основні транспортні засоби.
        if (isPrimary)
        {
            var otherPrimaryForDriver = await _context.DriverVehicles
                .Where(dv => dv.DriverId == driverId && dv.IsPrimary && dv.VehicleId != vehicleId)
                .ToListAsync();
            
            foreach (var dv in otherPrimaryForDriver)
            {
                dv.IsPrimary = false;
            }

            // 2. Крім того, якщо цей транспортний засіб стає основним для водія,
            // він не повинен бути основним (або навіть призначеним) для будь-кого іншого
            // Наразі треба переконатися, що цей транспортний засіб
            // не є основним для жодного іншого водія.
            var otherPrimaryForVehicle = await _context.DriverVehicles
                .Where(dv => dv.VehicleId == vehicleId && dv.IsPrimary && dv.DriverId != driverId)
                .ToListAsync();

            foreach (var dv in otherPrimaryForVehicle)
            {
                dv.IsPrimary = false;
            }
        }

        // 3. Перевірка, чи вже існує це конкретне завдання
        var existingAssignment = await _context.DriverVehicles
            .FirstOrDefaultAsync(dv => dv.VehicleId == vehicleId && dv.DriverId == driverId);

        if (existingAssignment != null)
        {
            // Оновити існуюче
            existingAssignment.IsPrimary = isPrimary;
            existingAssignment.AssignedAt = DateTime.UtcNow;
            _context.DriverVehicles.Update(existingAssignment);
        }
        else
        {
            // Створити новий
            var driverVehicle = new DriverVehicle
            {
                VehicleId = vehicleId,
                DriverId = driverId,
                IsPrimary = isPrimary,
                AssignedAt = DateTime.UtcNow
            };
            await _context.DriverVehicles.AddAsync(driverVehicle);
        }

        await _context.SaveChangesAsync();
    }

    public async Task UnassignVehicleFromDriverAsync(int vehicleId, int driverId)
    {
        var driverVehicle = await _context.DriverVehicles
            .FirstOrDefaultAsync(dv => dv.VehicleId == vehicleId && dv.DriverId == driverId);

        if (driverVehicle != null)
        {
            _context.DriverVehicles.Remove(driverVehicle);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdateMileageAsync(int vehicleId, float additionalMileage)
    {
        await _context.Vehicles
            .Where(v => v.Id == vehicleId)
            .ExecuteUpdateAsync(s => s.SetProperty(v => v.TotalMileage, v => v.TotalMileage + additionalMileage));
    }
}
