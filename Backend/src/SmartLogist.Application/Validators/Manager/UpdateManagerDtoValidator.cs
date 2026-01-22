using FluentValidation;
using SmartLogist.Application.DTOs.Manager;

namespace SmartLogist.Application.Validators.Manager;

public class UpdateManagerDtoValidator : AbstractValidator<UpdateManagerDto>
{
    public UpdateManagerDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Повне ім'я обов'язкове")
            .MaximumLength(255).WithMessage("Повне ім'я занадто довге")
            .Matches(@"^[а-яА-ЯіІїЇєЄґҐa-zA-Z\s'-]+$").WithMessage("Повне ім'я містить недопустимі символи");

        RuleFor(x => x.Phone)
            .Matches(@"^\+380\d{9}$").WithMessage("Телефон має бути у форматі +380XXXXXXXXX")
            .When(x => !string.IsNullOrEmpty(x.Phone));
    }
}
