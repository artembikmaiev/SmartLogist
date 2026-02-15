// Клас валідації для перевірки даних при створенні нового профілю водія.
using FluentValidation;
using SmartLogist.Application.DTOs.Driver;

namespace SmartLogist.Application.Validators.Driver;

public class CreateDriverDtoValidator : AbstractValidator<CreateDriverDto>
{
    public CreateDriverDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email є обов'язковим")
            .EmailAddress().WithMessage("Невірний формат email")
            .MaximumLength(100).WithMessage("Email не може перевищувати 100 символів");

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Повне ім'я є обов'язковим")
            .MinimumLength(2).WithMessage("Повне ім'я має містити мінімум 2 символи")
            .MaximumLength(100).WithMessage("Повне ім'я не може перевищувати 100 символів");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль є обов'язковим")
            .MinimumLength(8).WithMessage("Пароль має містити мінімум 8 символів")
            .MaximumLength(100).WithMessage("Пароль не може перевищувати 100 символів");

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Невірний формат телефону")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.LicenseNumber)
            .MaximumLength(50).WithMessage("Номер ліцензії не може перевищувати 50 символів")
            .When(x => !string.IsNullOrEmpty(x.LicenseNumber));
    }
}
