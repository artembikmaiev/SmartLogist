using System.Text.Json.Serialization;

namespace SmartLogist.Application.DTOs.External;

public class TomTomResponse
{
    [JsonPropertyName("routes")]
    public List<TomTomRoute> Routes { get; set; } = new();
}

public class TomTomRoute
{
    [JsonPropertyName("summary")]
    public TomTomSummary Summary { get; set; } = null!;

    [JsonPropertyName("legs")]
    public List<TomTomLeg> Legs { get; set; } = new();
}

public class TomTomSummary
{
    [JsonPropertyName("lengthInMeters")]
    public double LengthInMeters { get; set; }

    [JsonPropertyName("travelTimeInSeconds")]
    public int TravelTimeInSeconds { get; set; }

    [JsonPropertyName("trafficDelayInSeconds")]
    public int TrafficDelayInSeconds { get; set; }
}

public class TomTomLeg
{
    [JsonPropertyName("points")]
    public List<TomTomPoint> Points { get; set; } = new();
}

public class TomTomPoint
{
    [JsonPropertyName("latitude")]
    public double Latitude { get; set; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; set; }
}
