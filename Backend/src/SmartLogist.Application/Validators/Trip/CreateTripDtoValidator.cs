// Клас валідації для перевірки коректності даних при створенні нового рейсу.
using FluentValidation;
using SmartLogist.Application.DTOs.Trip;

namespace SmartLogist.Application.Validators.Trip;

public class CreateTripDtoValidator : AbstractValidator<CreateTripDto>
{
    public CreateTripDtoValidator()
    {
        RuleFor(x => x.OriginCity).NotEmpty().WithMessage("Місто відправлення обов'язкове");
        RuleFor(x => x.DestinationCity).NotEmpty().WithMessage("Місто прибуття обов'язкове");
        
        RuleFor(x => x.CargoWeight)
            .GreaterThan(0).WithMessage("Вага вантажу повинна бути більшою за 0");
            
        RuleFor(x => x.ScheduledDeparture)
            .GreaterThanOrEqualTo(DateTime.UtcNow.AddMinutes(-5))
            .WithMessage("Дата виїзду не може бути в минулому");

        RuleFor(x => x.ScheduledArrival)
            .GreaterThan(x => x.ScheduledDeparture)
            .WithMessage("Дата прибуття повинна бути пізніше дати виїзду");

        RuleFor(x => x.PaymentAmount)
            .GreaterThan(0).WithMessage("Сума оплати повинна бути більшою за 0");

        RuleFor(x => x.DriverId).GreaterThan(0).WithMessage("Потрібно обрати водія");
    }
}
