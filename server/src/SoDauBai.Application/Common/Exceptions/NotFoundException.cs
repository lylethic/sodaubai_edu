using System.Net;

namespace SoDauBai.Application.Common.Exceptions;

public class NotFoundException : ApiException
{
    public NotFoundException(string message) : base(message, HttpStatusCode.NotFound)
    {
    }
}
