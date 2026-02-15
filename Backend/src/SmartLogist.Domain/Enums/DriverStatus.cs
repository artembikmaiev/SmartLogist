// Цей файл містить перелік станів доступності водія для виконання рейсів.
namespace SmartLogist.Domain.Enums;

// Статус водія
public enum DriverStatus
{
    Available = 1,
    OnTrip = 2,
    Offline = 3,
    OnBreak = 4
}
