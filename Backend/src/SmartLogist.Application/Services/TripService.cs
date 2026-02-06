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
    private readonly IUserRepository _userRepository;
    private readonly IAdminRequestService _adminRequestService;
    private readonly IVehicleRepository _vehicleRepository;
    private readonly ILocationRepository _locationRepository;
    private readonly ICargoRepository _cargoRepository;

    public TripService(
        ITripRepository tripRepository, 
        IActivityService activityService, 
        IUserRepository userRepository,
        IAdminRequestService adminRequestService,
        IVehicleRepository vehicleRepository,
        ILocationRepository locationRepository,
        ICargoRepository cargoRepository)
    {
        _tripRepository = tripRepository;
        _activityService = activityService;
        _userRepository = userRepository;
        _adminRequestService = adminRequestService;
        _vehicleRepository = vehicleRepository;
        _locationRepository = locationRepository;
        _cargoRepository = cargoRepository;
    }

    public async Task<IEnumerable<TripDto>> GetDriverTripsAsync(int driverId)
    {
        var trips = await _tripRepository.GetByDriverIdAsync(driverId);
        return trips.Select(t => MapToDto(t, new List<int>()));
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
        var trip = await _tripRepository.GetByOnlyIdAsync(tripId);
        if (trip == null || trip.DriverId != driverId)
            throw new KeyNotFoundException("Рейс не знайдено");

        if (trip.Status != TripStatus.Pending)
            throw new InvalidOperationException("Рейс не можна прийняти в даному статусі");

        // Use direct atomic update to bypass partition key matching issues for status transition
        await _tripRepository.ChangeStatusAsync(tripId, TripStatus.Accepted);

        // Update driver status to OnTrip
        var driver = await _userRepository.GetByIdAsync(driverId);
        if (driver != null)
        {
            driver.DriverStatus = DriverStatus.OnTrip;
            await _userRepository.UpdateAsync(driver);
        }

        await _activityService.LogAsync(
            driverId,
            "Прийнято рейс",
            $"#{trip.Id} ({trip.Origin?.City} - {trip.Destination?.City})",
            "Trip",
            trip.Id.ToString()
        );
    }

    public async Task DeclineTripAsync(int tripId, int driverId)
    {
        var trip = await _tripRepository.GetByOnlyIdAsync(tripId);
        if (trip == null || trip.DriverId != driverId)
            throw new KeyNotFoundException("Рейс не знайдено");

        if (trip.Status != TripStatus.Pending)
            throw new InvalidOperationException("Рейс не можна відхилити в даному статусі");

        // Use direct atomic update 
        await _tripRepository.ChangeStatusAsync(tripId, TripStatus.Declined);

        await _activityService.LogAsync(
            driverId,
            "Відхилено рейс",
            $"#{trip.Id} ({trip.Origin?.City} - {trip.Destination?.City})",
            "Trip",
            trip.Id.ToString()
        );
    }

    public async Task<TripDto> CreateTripAsync(CreateTripDto dto, int managerId)
    {
        // Get or Create Locations
        var origin = await _locationRepository.GetByCityAndAddressAsync(dto.OriginCity, dto.OriginAddress)
                     ?? await _locationRepository.AddAsync(new Location 
                     { 
                         City = dto.OriginCity, 
                         Address = dto.OriginAddress,
                         Latitude = dto.OriginLatitude,
                         Longitude = dto.OriginLongitude
                     });
        
        var destination = await _locationRepository.GetByCityAndAddressAsync(dto.DestinationCity, dto.DestinationAddress)
                          ?? await _locationRepository.AddAsync(new Location 
                          { 
                              City = dto.DestinationCity, 
                              Address = dto.DestinationAddress,
                              Latitude = dto.DestinationLatitude,
                              Longitude = dto.DestinationLongitude
                          });

        // Get or Create Cargo (Simple implementation)
        var cargo = await _cargoRepository.AddAsync(new Cargo { Name = dto.CargoName ?? "Unknown", TypeId = (int)dto.CargoType });

        var trip = new Trip
        {
            OriginId = origin.Id,
            DestinationId = destination.Id,
            ScheduledDeparture = dto.ScheduledDeparture,
            ScheduledArrival = dto.ScheduledArrival,
            PaymentAmount = dto.PaymentAmount,
            Currency = dto.Currency,
            DistanceKm = dto.DistanceKm,
            DriverId = dto.DriverId,
            VehicleId = dto.VehicleId,
            Notes = dto.Notes,
            ManagerId = managerId,
            Status = TripStatus.Pending,
            
            // Economic info
            CargoId = cargo.Id,
            CargoWeight = dto.CargoWeight,
            ExpectedProfit = dto.ExpectedProfit,
            EstimatedFuelCost = dto.EstimatedFuelCost
        };

        // Vertical partitioning: Route
        trip.Route = new TripRoute
        {
            DepartureTime = dto.ScheduledDeparture,
            RouteGeometry = dto.RouteGeometry
        };

        var createdTrip = await _tripRepository.AddAsync(trip);
        
        // Refresh to get navigation properties
        var result = await _tripRepository.GetWithDetailsAsync(createdTrip.Id, createdTrip.ScheduledDeparture);
        return MapToDto(result!, new List<int>());
    }

    public async Task<IEnumerable<TripDto>> GetManagerTripsAsync(int managerId)
    {
        var trips = await _tripRepository.GetByManagerIdAsync(managerId);
        var pendingRequests = await _adminRequestService.GetPendingRequestsAsync();
        
        var pendingDeletionTargetIds = pendingRequests
            .Where(r => r.Type == RequestType.TripDeletion && r.TargetId.HasValue)
            .Select(r => r.TargetId!.Value)
            .ToList();

        return trips.Select(t => MapToDto(t, pendingDeletionTargetIds));
    }

    public async Task<ManagerStatsSummaryDto> GetManagerStatsSummaryAsync(int managerId)
    {
        var trips = await _tripRepository.GetByManagerIdAsync(managerId);
        var tripList = trips.ToList();
        var today = DateTime.UtcNow.Date;

        return new ManagerStatsSummaryDto
        {
            ActiveTripsCount = tripList.Count(t => t.Status == TripStatus.InTransit),
            PendingTripsCount = tripList.Count(t => t.Status == TripStatus.Pending),
            CompletedTripsTodayCount = tripList.Count(t => t.Status == TripStatus.Completed && t.ActualArrival?.Date == today),
            TotalFuelForecast = tripList.Where(t => t.Status == TripStatus.InTransit || t.Status == TripStatus.Accepted)
                                       .Sum(t => t.DistanceKm * 0.35m) 
        };
    }

    public async Task UpdateTripAsync(int tripId, UpdateTripDto dto)
    {
        var trip = await _tripRepository.GetByOnlyIdAsync(tripId);
        if (trip == null)
            throw new KeyNotFoundException("Рейс не знайдено");

        if (!string.IsNullOrEmpty(dto.Status))
        {
            if (Enum.TryParse<TripStatus>(dto.Status, true, out var newStatus))
            {
                if (newStatus == TripStatus.InTransit && trip.Status != TripStatus.InTransit)
                {
                    trip.ActualDeparture = DateTime.UtcNow;
                }
                else if (newStatus == TripStatus.Arrived && (trip.Status == TripStatus.InTransit || trip.Status == TripStatus.Accepted))
                {
                    trip.ActualArrival = DateTime.UtcNow;
                }
                else if (newStatus == TripStatus.Completed && trip.Status != TripStatus.Completed)
                {
                    if (trip.ActualArrival == null) trip.ActualArrival = DateTime.UtcNow;

                    if (trip.VehicleId.HasValue && !trip.IsMileageAccounted)
                    {
                        var vehicle = await _vehicleRepository.GetByIdAsync(trip.VehicleId.Value);
                        if (vehicle != null)
                        {
                            vehicle.TotalMileage += trip.CargoWeight > 0 ? trip.CargoWeight : 0; // Fixed mileage logic dummy
                            vehicle.TotalMileage += (float)trip.DistanceKm;
                            trip.IsMileageAccounted = true;
                            await _vehicleRepository.UpdateAsync(vehicle);
                        }
                    }
                }

                trip.Status = newStatus;

                var driver = await _userRepository.GetByIdAsync(trip.DriverId);
                if (driver != null)
                {
                    if (newStatus == TripStatus.InTransit || newStatus == TripStatus.Arrived)
                        driver.DriverStatus = DriverStatus.OnTrip;
                    else if (newStatus == TripStatus.Completed || newStatus == TripStatus.Cancelled || newStatus == TripStatus.Declined)
                        driver.DriverStatus = DriverStatus.Available;
                    await _userRepository.UpdateAsync(driver);
                }
            }
        }

        if (dto.ActualDeparture.HasValue) trip.ActualDeparture = dto.ActualDeparture;
        if (dto.ActualArrival.HasValue) trip.ActualArrival = dto.ActualArrival;
        if (dto.Notes != null) trip.Notes = dto.Notes;

        if (dto.ActualFuelConsumption.HasValue)
        {
            trip.ActualFuelConsumption = dto.ActualFuelConsumption;
            var realFuelCost = (trip.DistanceKm / 100m) * (decimal)dto.ActualFuelConsumption.Value * trip.FuelPrice;
            var oldFuelCost = trip.EstimatedFuelCost;
            trip.EstimatedFuelCost = Math.Round(realFuelCost, 2);
            trip.ExpectedProfit = trip.ExpectedProfit + (oldFuelCost - trip.EstimatedFuelCost);
        }

        // Vertical partitioning feedback
        if (dto.Rating.HasValue || dto.ManagerReview != null)
        {
            if (trip.Feedback == null)
            {
                trip.Feedback = new TripFeedback
                {
                    DepartureTime = trip.ScheduledDeparture,
                    Rating = dto.Rating,
                    ManagerReview = dto.ManagerReview
                };
            }
            else
            {
                if (dto.Rating.HasValue) trip.Feedback.Rating = dto.Rating;
                if (dto.ManagerReview != null) trip.Feedback.ManagerReview = dto.ManagerReview;
            }
        }

        await _tripRepository.UpdateAsync(trip);
    }

    public async Task DeleteTripAsync(int tripId, int managerId)
    {
        var trip = await _tripRepository.GetByOnlyIdAsync(tripId);
        if (trip == null)
            throw new KeyNotFoundException("Рейс не знайдено");

        if (trip.ManagerId != managerId)
            throw new UnauthorizedAccessException("Ви не маєте прав для видалення цього рейсу");

        await _adminRequestService.CreateRequestAsync(new SmartLogist.Application.DTOs.AdminRequest.CreateRequestDto
        {
            Type = RequestType.TripDeletion,
            TargetId = tripId,
            TargetName = $"Рейс #{tripId} ({trip.Origin?.City} - {trip.Destination?.City})",
            Comment = "Запит на видалення рейсу від менеджера"
        }, managerId);

        await _activityService.LogAsync(
            managerId,
            "Створено запит на видалення рейсу",
            $"#{tripId}",
            "Trip",
            tripId.ToString()
        );
    }

    private TripDto MapToDto(Trip trip, IEnumerable<int> pendingDeletionTargetIds)
    {
        return new TripDto
        {
            Id = trip.Id,
            OriginCity = trip.Origin?.City ?? "Unknown City",
            OriginAddress = trip.Origin?.Address ?? "Unknown Address",
            OriginLatitude = trip.Origin?.Latitude,
            OriginLongitude = trip.Origin?.Longitude,
            DestinationCity = trip.Destination?.City ?? "Unknown City",
            DestinationAddress = trip.Destination?.Address ?? "Unknown Address",
            DestinationLatitude = trip.Destination?.Latitude,
            DestinationLongitude = trip.Destination?.Longitude,
            ScheduledDeparture = trip.ScheduledDeparture,
            ScheduledArrival = trip.ScheduledArrival,
            ActualDeparture = trip.ActualDeparture,
            ActualArrival = trip.ActualArrival,
            PaymentAmount = trip.PaymentAmount,
            Currency = trip.Currency,
            DistanceKm = trip.DistanceKm,
            Status = trip.Status.ToString(),
            Notes = trip.Notes,
            Rating = trip.Feedback?.Rating,
            ManagerReview = trip.Feedback?.ManagerReview,
            ManagerId = trip.ManagerId,
            ManagerName = trip.Manager?.FullName ?? "Адміністратор",
            VehicleId = trip.VehicleId,
            VehicleModel = trip.Vehicle?.Model,
            VehicleLicensePlate = trip.Vehicle?.LicensePlate,
            HasPendingDeletion = pendingDeletionTargetIds.Contains(trip.Id),
            
            CargoName = trip.Cargo?.Name,
            CargoType = trip.Cargo?.TypeId.ToString() ?? "0",
            CargoWeight = trip.CargoWeight,
            ExpectedProfit = trip.ExpectedProfit,
            EstimatedFuelCost = trip.EstimatedFuelCost,
            DriverEarnings = trip.PaymentAmount - trip.EstimatedFuelCost - trip.ExpectedProfit,
            ActualFuelConsumption = trip.ActualFuelConsumption,
            RouteGeometry = trip.Route?.RouteGeometry ?? ""
        };
    }
}
