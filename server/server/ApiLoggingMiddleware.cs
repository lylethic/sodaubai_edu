using server.Interfaces;

namespace server
{
  public class ApiLoggingMiddleware
  {
    private readonly RequestDelegate _next;
    private readonly ILogManager _logger;

    public ApiLoggingMiddleware(RequestDelegate next, ILogManager logger)
    {
      _next = next;
      _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
      var method = context.Request.Method;
      var url = context.Request.Path + context.Request.QueryString;

      await _next(context);

      var statusCode = context.Response.StatusCode;

      var endpoint = context.GetEndpoint();
      var apiName = endpoint?.DisplayName ?? "Unknown API";

      if (!url.Contains("swagger"))
      {
        _logger.Info($"[{method}] {url} => Status: {statusCode} | Endpoint: {apiName}");
      }
    }
  }
}
