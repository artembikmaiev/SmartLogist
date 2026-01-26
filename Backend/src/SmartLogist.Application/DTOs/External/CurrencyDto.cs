namespace SmartLogist.Application.DTOs.External;

public class CurrencyDto
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public double Rate { get; set; }
    public double Change { get; set; }
    public string Date { get; set; } = string.Empty;
}
