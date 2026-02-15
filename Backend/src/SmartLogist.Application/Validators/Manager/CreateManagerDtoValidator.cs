// Клас валідації для перевірки даних при створенні нового облікового запису менеджера.
using FluentValidation;
using SmartLogist.Application.DTOs.Manager;

namespace SmartLogist.Application.Validators.Manager;

public class CreateManagerDtoValidator : AbstractValidator<CreateManagerDto>
{
    public CreateManagerDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обов'язковий")
            .EmailAddress().WithMessage("Невалідний формат email")
            .MaximumLength(255).WithMessage("Email занадто довгий");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обов'язковий")
            .MinimumLength(8).WithMessage("Пароль має бути мінімум 8 символів")
            .Matches(@"[A-Z]").WithMessage("Пароль має містити хоча б одну велику літеру")
            .Matches(@"[a-z]").WithMessage("Пароль має містити хоча б одну малу літеру")
            .Matches(@"[0-9]").WithMessage("Пароль має містити хоча б одну цифру");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Повне ім'я обов'язкове")
            .MaximumLength(255).WithMessage("Повне ім'я занадто довге")
            .Matches(@"^[а-яА-ЯіІїЇєЄґҐa-zA-Z\s'-]+$").WithMessage("Повне ім'я містить недопустимі символи");

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Невірний формат телефону")
            .When(x => !string.IsNullOrEmpty(x.Phone));
    }
}
