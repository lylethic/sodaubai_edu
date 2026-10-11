using System.Net;

namespace SoDauBai.Application.Common.Exceptions;

public class BadRequestException : ApiException
{
    public BadRequestException(string message) : base(message, HttpStatusCode.BadRequest)
    {
    }
}
