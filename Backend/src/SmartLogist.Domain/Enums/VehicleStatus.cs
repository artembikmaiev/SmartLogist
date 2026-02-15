// Цей файл містить перелік можливих станів транспортного засобу в системі.
namespace SmartLogist.Domain.Enums;

// Статус транспортного засобу
public enum VehicleStatus
{
    Available = 1,
    InUse = 2,
    Maintenance = 3,
    Inactive = 4
}
