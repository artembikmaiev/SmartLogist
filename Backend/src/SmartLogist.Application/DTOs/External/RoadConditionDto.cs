namespace SmartLogist.Application.DTOs.External;

public class RoadConditionDto
{
    public string Route { get; set; } = string.Empty;
    public string RoadName { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string StatusColor { get; set; } = "blue"; 
}
