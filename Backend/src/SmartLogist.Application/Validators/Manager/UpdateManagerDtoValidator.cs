// Клас валідації для перевірки оновленої інформації про менеджера та його контактних даних.
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
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Невірний формат телефону")
            .When(x => !string.IsNullOrEmpty(x.Phone));
    }
}
