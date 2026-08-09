using System.Net;

namespace server.Common.Exceptions
{
  public class BadRequestException : ApiException
  {
    public BadRequestException(string message = "Bad request")
        : base(message, HttpStatusCode.BadRequest)
    {
    }
  }
}
