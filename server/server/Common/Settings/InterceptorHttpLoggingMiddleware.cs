namespace server.Common.Settings;

public class InterceptorHttpLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<InterceptorHttpLoggingMiddleware> _logger;

    public InterceptorHttpLoggingMiddleware(RequestDelegate next, ILogger<InterceptorHttpLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var method = context.Request.Method;
        var path = context.Request.Path;
        _logger.LogInformation("Request: {Method} {Path}", method, path);

        var originalBody = context.Response.Body;
        using var newBody = new MemoryStream();
        context.Response.Body = newBody;

        await _next(context);

        newBody.Seek(0, SeekOrigin.Begin);
        var statusCode = context.Response.StatusCode;
        _logger.LogInformation("Response: {StatusCode}", statusCode);

        newBody.Seek(0, SeekOrigin.Begin);
        await newBody.CopyToAsync(originalBody);
    }
}
