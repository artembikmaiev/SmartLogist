using SmartLogist.Application.DTOs.Trip;
using SmartLogist.Application.Interfaces;
using SmartLogist.Domain.Entities;
using SmartLogist.Domain.Enums;
using SmartLogist.Domain.Interfaces;

namespace SmartLogist.Application.Services;

public class TripService : ITripService
{
    private readonly ITripRepository _tripRepository;
    private readonly IActivityService _activityService;

    public TripService(ITripRepository tripRepository, IActivityService activityService)
    {
        _tripRepository = tripRepository;
        _activityService = activityService;
    }

    public async Task<IEnumerable<TripDto>> GetDriverTripsAsync(int driverId)
    {
        var trips = await _tripRepository.GetByDriverIdAsync(driverId);
        return trips.Select(MapToDto);
    }

    public async Task<DriverStatsSummaryDto> GetDriverStatsSummaryAsync(int driverId)
    {
        var now = DateTime.UtcNow;
        var trips = (await _tripRepository.GetByDriverIdAsync(driverId)).ToList();

        return new DriverStatsSummaryDto
        {
            CurrentTripsCount = trips.Count(t => t.Status == TripStatus.InTransit),
            CompletedTripsCount = await _tripRepository.GetCompletedCountByDriverIdAsync(driverId),
            TotalDistance = await _tripRepository.GetTotalDistanceByDriverIdAsync(driverId, now.Month, now.Year),
            TotalEarnings = await _tripRepository.GetTotalEarningsByDriverIdAsync(driverId, now.Month, now.Year),
            EarningsSubtitle = "грн цього місяця"
        };
    }

    public async Task AcceptTripAsync(int tripId, int driverId)
    {
        var trip = await _tripRepository.GetByIdAsync(tripId);
        if (trip == null || trip.DriverId != driverId)
            throw new KeyNotFoundException("Рейс не знайдено");

        if (trip.Status != TripStatus.Pending)
            throw new InvalidOperationException("Рейс не можна прийняти в даному статусі");

        trip.Status = TripStatus.Accepted;
        await _tripRepository.UpdateAsync(trip);

        await _activityService.LogAsync(
            driverId,
            "Прийнято рейс",
            $"#{trip.Id} ({trip.OriginCity} - {trip.DestinationCity})",
            "Trip",
            trip.Id.ToString()
        );
    }

    public async Task DeclineTripAsync(int tripId, int driverId)
    {
        var trip = await _tripRepository.GetByIdAsync(tripId);
        if (trip == null || trip.DriverId != driverId)
            throw new KeyNotFoundException("Рейс не знайдено");

        if (trip.Status != TripStatus.Pending)
            throw new InvalidOperationException("Рейс не можна відхилити в даному статусі");

        trip.Status = TripStatus.Declined;
        await _tripRepository.UpdateAsync(trip);

        await _activityService.LogAsync(
            driverId,
            "Відхилено рейс",
            $"#{trip.Id} ({trip.OriginCity} - {trip.DestinationCity})",
            "Trip",
            trip.Id.ToString()
        );
    }

    private TripDto MapToDto(Trip trip)
    {
        return new TripDto
        {
            Id = trip.Id,
            OriginCity = trip.OriginCity,
            OriginAddress = trip.OriginAddress,
            DestinationCity = trip.DestinationCity,
            DestinationAddress = trip.DestinationAddress,
            ScheduledDeparture = trip.ScheduledDeparture,
            ScheduledArrival = trip.ScheduledArrival,
            ActualDeparture = trip.ActualDeparture,
            ActualArrival = trip.ActualArrival,
            PaymentAmount = trip.PaymentAmount,
            Currency = trip.Currency,
            DistanceKm = trip.DistanceKm,
            Status = trip.Status.ToString(),
            Notes = trip.Notes,
            ManagerId = trip.ManagerId,
            ManagerName = trip.Manager?.FullName ?? "Адміністратор",
            VehicleId = trip.VehicleId,
            VehicleModel = trip.Vehicle?.Model,
            VehicleLicensePlate = trip.Vehicle?.LicensePlate
        };
    }
}
