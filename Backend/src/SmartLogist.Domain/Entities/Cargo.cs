// Сутність, що описує характеристики та тип вантажу, який перевозиться під час рейсу.
using SmartLogist.Domain.Enums;

namespace SmartLogist.Domain.Entities;

public class Cargo
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TypeId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
