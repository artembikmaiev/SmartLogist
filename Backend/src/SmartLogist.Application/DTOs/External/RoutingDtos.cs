using System.Text.Json.Serialization;

// Набір об'єктів передачі даних для обміну географічними координатами та параметрами маршрутів.
namespace SmartLogist.Application.DTOs.External;

public class RoutePoint
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class RouteRequestDto
{
    public RoutePoint Origin { get; set; } = null!;
    public RoutePoint Destination { get; set; } = null!;
}

public class RouteResponseDto
{
    public double DistanceKm { get; set; }
    public int DurationMinutes { get; set; }
    public List<List<double>> Geometry { get; set; } = new(); // [[lat, lng], ...]
}
