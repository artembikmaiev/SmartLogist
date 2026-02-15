// Сутність, що представляє зв'язок між водієм та транспортним засобом, включаючи статус основного призначення.
namespace SmartLogist.Domain.Entities;

public class DriverVehicle
{
    public int Id { get; set; }
    
    public int DriverId { get; set; }
    public virtual User Driver { get; set; } = null!;
    public int VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; } = null!;
    public bool IsPrimary { get; set; } = false;
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
}
