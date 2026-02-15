// Цей компонент проміжного ПЗ забезпечує централізовану обробку та логування винятків у всьоому додатку.
using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SmartLogist.WebAPI.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            // Логування детальної інформації про виняток, включаючи внутрішні помилки
            var innerEx = ex.InnerException;
            var exceptionDetails = $"Exception: {ex.Message}";
            if (innerEx != null)
            {
                exceptionDetails += $"\nInner Exception: {innerEx.Message}";
                if (innerEx.InnerException != null)
                {
                    exceptionDetails += $"\nInner Inner Exception: {innerEx.InnerException.Message}";
                }
            }
            _logger.LogError(ex, "An unhandled exception occurred. Details: {Details}", exceptionDetails);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var statusCode = exception switch
        {
            KeyNotFoundException => HttpStatusCode.NotFound,
            UnauthorizedAccessException => HttpStatusCode.Unauthorized,
            InvalidOperationException or DbUpdateException => HttpStatusCode.BadRequest,
            _ => HttpStatusCode.InternalServerError
        };

        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            StatusCode = context.Response.StatusCode,
            Message = GetUserFriendlyMessage(exception, statusCode)
        };

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }

    private static string GetUserFriendlyMessage(Exception exception, HttpStatusCode statusCode)
    {
        // Для помилок 500 приховуйте деталі в продакшені. Наразі ми повертаємо повідомлення.
        // Для інших відомих помилок повертаємо повідомлення про виняток належним чином.
        if (statusCode == HttpStatusCode.Unauthorized || statusCode == HttpStatusCode.Forbidden)
        {
            return exception.Message;
        }

        // Для DbUpdateException включаємо деталі внутрішнього винятку для відлагодження
        if (exception is DbUpdateException dbEx && dbEx.InnerException != null)
        {
            return $"{exception.Message} | Inner: {dbEx.InnerException.Message}";
        }

        if (statusCode == HttpStatusCode.InternalServerError)
        {
            // Для відлагодження повертаємо фактичне повідомлення, якщо це не продакшн
            // У справжньому продакшн-додатку тут слід було б перевіряти середовище
            return $"Виникла внутрішня помилка сервера: {exception.Message}. {(exception.InnerException != null ? "Inner: " + exception.InnerException.Message : "")}";
        }

        return exception.Message;
    }
}
