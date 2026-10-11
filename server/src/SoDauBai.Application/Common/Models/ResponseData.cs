namespace SoDauBai.Application.Common.Models;

public class ResponseData<T>
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;

    public int Total { get; set; } = 0;
    public T? Data { get; set; }
    public List<T>? ListData { get; set; }

    public ResponseData()
    {
    }

    public ResponseData(int statusCode, string message)
    {
        StatusCode = statusCode;
        Message = message;
    }

    public ResponseData(int statusCode, T data)
    {
        StatusCode = statusCode;
        Data = data;
    }

    public ResponseData(int statusCode, string message, T data)
    {
        StatusCode = statusCode;
        Message = message;
        Data = data;
    }

    public ResponseData(int statusCode, string message, List<T> data)
    {
        StatusCode = statusCode;
        Message = message;
        ListData = data;
    }

    public ResponseData(int statusCode, string message, T data, int total)
    {
        StatusCode = statusCode;
        Message = message;
        Data = data;
        Total = total;
    }
}
