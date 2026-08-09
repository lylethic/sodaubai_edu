using System;
using System.Net;

namespace server.Common.Exceptions
{
  public abstract class ApiException : Exception
  {
    public HttpStatusCode StatusCode { get; }

    protected ApiException(string message, HttpStatusCode statusCode) : base(message)
    {
      StatusCode = statusCode;
    }
  }
}
