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
            _logger.LogError(ex, "An unhandled exception occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var statusCode = exception switch
        {
            KeyNotFoundException => HttpStatusCode.NotFound,
            UnauthorizedAccessException => HttpStatusCode.Forbidden,
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
        // For 500 errors, hide details in production. For now, we return the message.
        // For other known errors, return the exception message properly.
        if (statusCode == HttpStatusCode.Forbidden)
        {
            return "У вас недостатньо прав для виконання цієї дії.";
        }

        return statusCode == HttpStatusCode.InternalServerError 
            ? "Виникла внутрішня помилка сервера. Будь ласка, спробуйте пізніше або зверніться до підтримки." 
            : exception.Message;
    }
}
