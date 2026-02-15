// Цей файл містить переліки типів запитів та їх станів для системи адміністрування.
namespace SmartLogist.Domain.Enums;

public enum RequestType
{
    DriverDeletion = 1,
    DriverUpdate = 2,
    VehicleDeletion = 3,
    VehicleUpdate = 4,
    DriverCreation = 5,
    VehicleCreation = 6,
    TripDeletion = 7,
    Other = 99
}

public enum RequestStatus
{
    Pending = 1,
    Approved = 2,
    Rejected = 3
}
