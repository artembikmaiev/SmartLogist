// Перелік категорій вантажів, що підтримуються системою для перевезення.
namespace SmartLogist.Domain.Enums;

public enum CargoType
{
    Standard,
    Fragile,
    Hazardous,
    Refrigerated,
    Urgent,
    Heavy
}
