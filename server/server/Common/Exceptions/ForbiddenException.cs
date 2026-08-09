using System.Net;

namespace server.Common.Exceptions
{
  public class ForbiddenException : ApiException
  {
    public ForbiddenException(string message = "Access forbidden")
        : base(message, HttpStatusCode.Forbidden)
    {
    }
  }
}
