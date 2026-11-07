using System.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;

namespace SoDauBai.Api.Middlewares;

public class ApiLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiLoggingMiddleware> _logger;

    public ApiLoggingMiddleware(RequestDelegate next, ILogger<ApiLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();

        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();

            var route = (context.GetEndpoint() as RouteEndpoint)?.RoutePattern.RawText ?? "unmatched";
            if (!route.StartsWith("swagger", StringComparison.OrdinalIgnoreCase))
            {
                var traceId = Activity.Current?.TraceId.ToString() ?? context.TraceIdentifier;
                _logger.LogInformation(
                    "HTTP {Method} {Route} returned {StatusCode} in {ElapsedMilliseconds} ms; TraceId={TraceId}",
                    context.Request.Method,
                    route,
                    context.Response.StatusCode,
                    stopwatch.Elapsed.TotalMilliseconds,
                    traceId);
            }
        }
    }
}
