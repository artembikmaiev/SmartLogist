// Інтерфейс сервісу для отримання актуальної інформації про стан дорожнього покриття та попереджень.
using SmartLogist.Application.DTOs.External;

namespace SmartLogist.Application.Interfaces;

public interface IRoadConditionService
{
    Task<IEnumerable<RoadConditionDto>> GetRoadConditionsAsync();
}
