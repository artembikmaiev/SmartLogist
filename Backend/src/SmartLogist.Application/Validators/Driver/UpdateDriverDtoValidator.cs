using FluentValidation;
using SmartLogist.Application.DTOs.Driver;

namespace SmartLogist.Application.Validators.Driver;

public class UpdateDriverDtoValidator : AbstractValidator<UpdateDriverDto>
{
    public UpdateDriverDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Повне ім'я є обов'язковим")
            .MinimumLength(2).WithMessage("Повне ім'я має містити мінімум 2 символи")
            .MaximumLength(100).WithMessage("Повне ім'я не може перевищувати 100 символів");

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("Невірний формат телефону")
            .When(x => !string.IsNullOrEmpty(x.Phone));

        RuleFor(x => x.LicenseNumber)
            .MaximumLength(50).WithMessage("Номер ліцензії не може перевищувати 50 символів")
            .When(x => !string.IsNullOrEmpty(x.LicenseNumber));

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Невірний статус водія");
    }
}
