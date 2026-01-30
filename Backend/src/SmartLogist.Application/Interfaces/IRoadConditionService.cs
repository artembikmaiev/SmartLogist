using SmartLogist.Application.DTOs.External;

namespace SmartLogist.Application.Interfaces;

public interface IRoadConditionService
{
    Task<IEnumerable<RoadConditionDto>> GetRoadConditionsAsync();
}
