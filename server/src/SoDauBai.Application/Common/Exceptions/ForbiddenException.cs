using System.Net;

namespace SoDauBai.Application.Common.Exceptions;

public class ForbiddenException : ApiException
{
    public ForbiddenException(string message) : base(message, HttpStatusCode.Forbidden)
    {
    }
}
