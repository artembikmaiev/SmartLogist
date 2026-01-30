using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Globalization;
using SmartLogist.Application.DTOs.External;
using SmartLogist.Application.Interfaces;

namespace SmartLogist.Application.Services;

public class RoadConditionService : IRoadConditionService
{
    private readonly HttpClient _httpClient;
    private const string BaseUrl = "https://api.open-meteo.com/v1/forecast";

    public RoadConditionService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<RoadConditionDto>> GetRoadConditionsAsync()
    {
        var routes = new[]
        {
            new { Name = "Київ", Road = "Центральний хаб", Lat = 50.45, Lon = 30.52 },
            new { Name = "Львів", Road = "Західний хаб", Lat = 49.84, Lon = 24.03 },
            new { Name = "Одеса", Road = "Південний хаб", Lat = 46.48, Lon = 30.72 },
            new { Name = "Дніпро", Road = "Східний хаб", Lat = 48.46, Lon = 35.04 },
            new { Name = "Харків", Road = "Північно-східний хаб", Lat = 49.99, Lon = 36.23 }
        };

        var result = new List<RoadConditionDto>();

        foreach (var route in routes)
        {
            try
            {
                var lat = route.Lat.ToString(CultureInfo.InvariantCulture);
                var lon = route.Lon.ToString(CultureInfo.InvariantCulture);
                var url = $"{BaseUrl}?latitude={lat}&longitude={lon}&current=weather_code&timezone=auto";
                var response = await _httpClient.GetFromJsonAsync<OpenMeteoResponse>(url);

                if (response?.Current != null)
                {
                    var condition = MapWeatherCode(response.Current.WeatherCode);
                    result.Add(new RoadConditionDto
                    {
                        Route = route.Name,
                        RoadName = route.Road,
                        Condition = condition.Label,
                        Description = condition.Description,
                        Icon = condition.Icon,
                        StatusColor = condition.Color
                    });
                }
                else
                {
                    throw new Exception("Відповідь від API порожня");
                }
            }
            catch (Exception ex)
            {
                // Резервний варіант для невдалих запитів
                result.Add(new RoadConditionDto
                {
                    Route = route.Name,
                    RoadName = route.Road,
                    Condition = "Невідомо",
                    Description = ex.Message, // Показати помилку для налагодження
                    Icon = "❓",
                    StatusColor = "blue"
                });
            }
        }

        return result;
    }

    private (string Label, string Description, string Icon, string Color) MapWeatherCode(int code)
    {
        return code switch
        {
            0 => ("Ясно", "Добре", "☀️", "green"),
            1 or 2 or 3 => ("Хмарно", "Задовільно", "☁️", "green"),
            45 or 48 => ("Туман", "Обережно", "⚠️", "orange"),
            51 or 53 or 55 => ("Мряка", "Слизько", "🌧️", "blue"),
            61 or 63 or 65 => ("Дощ", "Слизько", "🌧️", "blue"),
            71 or 73 or 75 => ("Сніг", "Ожеледиця", "❄️", "orange"),
            77 => ("Сніг", "Ожеледиця", "❄️", "orange"),
            80 or 81 or 82 => ("Злива", "Небезпечно", "🌊", "orange"),
            95 or 96 or 99 => ("Гроза", "Небезпечно", "⚡", "orange"),
            _ => ("Змінно", "Нормально", "⛅", "blue")
        };
    }

    private class OpenMeteoResponse
    {
        [JsonPropertyName("current")]
        public CurrentUnits? Current { get; set; }
    }

    private class CurrentUnits
    {
        [JsonPropertyName("weather_code")]
        public int WeatherCode { get; set; }
    }
}
