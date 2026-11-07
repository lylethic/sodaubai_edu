namespace SoDauBai.Application.Common.Models;

public class Error
{
    public string? Field { get; set; }
    public string? Message { get; set; }

    public Error()
    {
    }

    public Error(string field, string message)
    {
        Field = field;
        Message = message;
    }
}
