using System.Net.Http.Json;
using System.Globalization;
using Microsoft.Extensions.Configuration;
using SmartLogist.Application.DTOs.External;
using SmartLogist.Application.Interfaces;

// Цей сервіс забезпечує інтеграцію з API TomTom для розрахунку оптимальних маршрутів та відстаней між локаціями.
using Microsoft.Extensions.Caching.Memory;

namespace SmartLogist.Application.Services;

public class RoutingService : IRoutingService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly IMemoryCache _cache;

    public RoutingService(IHttpClientFactory httpClientFactory, IConfiguration configuration, IMemoryCache cache)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _cache = cache;
    }

    public async Task<RouteResponseDto> GetRouteAsync(
        RoutePoint origin, 
        RoutePoint destination,
        double? height = null,
        double? width = null,
        double? length = null,
        double? weight = null,
        bool? isHazardous = null)
    {
        var cacheKey = $"route_{origin.Latitude}_{origin.Longitude}_{destination.Latitude}_{destination.Longitude}_{height}_{width}_{length}_{weight}_{isHazardous}";
        
        if (_cache.TryGetValue(cacheKey, out RouteResponseDto? cachedRoute))
        {
            return cachedRoute!;
        }

        var tomTomKey = _configuration["MappingSettings:TomTomApiKey"];
        
        if (string.IsNullOrEmpty(tomTomKey) || tomTomKey == "YOUR_TOMTOM_API_KEY_HERE")
        {
            throw new Exception("TomTom API Key не налаштований. Перевірте appsettings.json.");
        }

        try
        {
            var route = await GetRouteFromTomTomAsync(origin, destination, tomTomKey, height, width, length, weight, isHazardous);

            // Кеш на 1 хвилину, щоб запобігти швидким повторним запитам
            _cache.Set(cacheKey, route, TimeSpan.FromMinutes(1));
            
            return route;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"TomTom routing request failed: {ex.Message}");
            throw new Exception($"Помилка маршрутизації TomTom: {ex.Message}");
        }
    }

    private async Task<RouteResponseDto> GetRouteFromTomTomAsync(
        RoutePoint origin, 
        RoutePoint destination, 
        string apiKey,
        double? height,
        double? width,
        double? length,
        double? weight,
        bool? isHazardous)
    {
        var originStr = $"{origin.Latitude.ToString(CultureInfo.InvariantCulture)},{origin.Longitude.ToString(CultureInfo.InvariantCulture)}";
        var destStr = $"{destination.Latitude.ToString(CultureInfo.InvariantCulture)},{destination.Longitude.ToString(CultureInfo.InvariantCulture)}";
        
        var client = _httpClientFactory.CreateClient("TomTom");
        
        // Базовий URL
        var url = $"https://api.tomtom.com/routing/1/calculateRoute/{originStr}:{destStr}/json?key={apiKey}&traffic=true&routeType=fastest";
        
        // Визначення режиму подорожі та додавання параметрів вантажівки, якщо вказано розміри або вагу
        if (height > 0 || width > 0 || length > 0 || weight > 0 || isHazardous == true)
        {
            url += "&travelMode=truck&vehicleCommercial=true";
            if (height > 0) url += $"&vehicleHeight={height.Value.ToString(CultureInfo.InvariantCulture)}";
            if (width > 0) url += $"&vehicleWidth={width.Value.ToString(CultureInfo.InvariantCulture)}";
            if (length > 0) url += $"&vehicleLength={length.Value.ToString(CultureInfo.InvariantCulture)}";
            
            // TomTom очікує вагу в кілограмах (ми отримуємо в тоннах)
            if (weight > 0) 
            {
                var weightKg = (int)(weight.Value * 1000);
                url += $"&vehicleWeight={weightKg.ToString(CultureInfo.InvariantCulture)}";
            }
            
            if (isHazardous == true) url += "&vehicleLoadType=otherHazmat";
        }
        else
        {
            url += "&travelMode=car";
        }
        
        Console.WriteLine($"TomTom routing: {url.Replace(apiKey, "***")}");
        
        var response = await client.GetAsync(url);
        if (response.IsSuccessStatusCode)
        {
            var tomTomData = await response.Content.ReadFromJsonAsync<TomTomResponse>();
            if (tomTomData?.Routes != null && tomTomData.Routes.Count > 0)
            {
                var route = tomTomData.Routes[0];
                return new RouteResponseDto
                {
                    DistanceKm = Math.Round(route.Summary.LengthInMeters / 1000, 1),
                    DurationMinutes = (int)Math.Round((double)route.Summary.TravelTimeInSeconds / 60),
                    Geometry = route.Legs.SelectMany(l => l.Points)
                                        .Select(p => new List<double> { p.Latitude, p.Longitude })
                                        .ToList()
                };
            }
        }
        
        var errorContent = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"TomTom API Error Response: {errorContent}");
        throw new Exception($"TomTom API повернув помилку {response.StatusCode}: {errorContent}");
    }
}
