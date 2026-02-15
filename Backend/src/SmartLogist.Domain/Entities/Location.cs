// Сутність, що представляє географічну локацію (адресу або місто) в системі логістики.
namespace SmartLogist.Domain.Entities;

public class Location
{
    public int Id { get; set; }
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}
