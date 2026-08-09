using System.Net;

namespace server.Common.Exceptions
{
  public class NotFoundException : ApiException
  {
    public NotFoundException(string message = "Resource not found")
        : base(message, HttpStatusCode.NotFound)
    {
    }
  }
}
