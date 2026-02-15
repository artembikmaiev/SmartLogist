// Інтерфейс сервісу для побудови оптимальних маршрутів та розрахунку відстаней між пунктами.
using SmartLogist.Application.DTOs.External;

namespace SmartLogist.Application.Interfaces;

public interface IRoutingService
{
    Task<RouteResponseDto> GetRouteAsync(
        RoutePoint origin, 
        RoutePoint destination, 
        double? height = null, 
        double? width = null, 
        double? length = null, 
        double? weight = null, 
        bool? isHazardous = null);
}
