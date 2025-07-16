using System.Net;
using System.Text.Json.Serialization;

namespace server.Common.Models;

public class ApiResponseModel
{
    [JsonPropertyName("httpStatus")]
    public HttpStatusCode HttpStatus { get; set; } = HttpStatusCode.OK;
    [JsonPropertyName("isSuccess")]
    public bool IsSuccess { get; set; } = true;
    [JsonPropertyName("data")]
    public object? Data { get; set; }
    [JsonPropertyName("errorCode")]
    public string ErrorCode { get; set; } = "";
    [JsonPropertyName("errorMessage")]
    public string ErrorMessage { get; set; } = "";

    public static ApiResponseModel Success<T>(T data, HttpStatusCode statusCode = HttpStatusCode.OK) where T : class
    {
        return new ApiResponseModel
        {
            HttpStatus = statusCode,
            IsSuccess = true,
            Data = data,
        };
    }

    public static ApiResponseModel Error(string errorMsg, HttpStatusCode statusCode = HttpStatusCode.InternalServerError, string errorCode = "")
    {
        return new ApiResponseModel
        {
            HttpStatus = statusCode,
            IsSuccess = false,
            ErrorCode = errorCode,
            ErrorMessage = errorMsg,
            Data = null
        };
    }
    public static ApiResponseModel ErrorWithData<T>(T data, string errorMsg, HttpStatusCode statusCode = HttpStatusCode.InternalServerError, string errorCode = "") where T : class
    {
        return new ApiResponseModel
        {
            HttpStatus = statusCode,
            IsSuccess = false,
            ErrorCode = errorCode,
            ErrorMessage = errorMsg,
            Data = data
        };
    }
}
