// Об'єкт передачі даних, що описує ціну та тип пального для розрахунку витрат на рейс.
namespace SmartLogist.Application.DTOs.External;

public class FuelPriceDto
{
    public string Type { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Change { get; set; }
    public string Name { get; set; } = string.Empty;
}
