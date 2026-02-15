// Перелік усіх можливих станів, у яких може перебувати рейс під час виконання.
namespace SmartLogist.Domain.Enums;

public enum TripStatus
{
    Pending,
    Accepted,
    Declined,
    InTransit,
    Arrived,
    Completed,
    Cancelled
}
