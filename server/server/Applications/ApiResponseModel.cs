using System;
using System.Net;
using System.Text.Json.Serialization;

namespace server.Applications;

public class ApiResponseModel
{
  [JsonPropertyName("status")]
  public HttpStatusCode? HttpStatus { get; set; } = HttpStatusCode.OK;
  [JsonPropertyName("success")]
  public bool IsSuccess { get; set; } = true;
  [JsonPropertyName("responseData")]
  public object? Data { get; set; }
  [JsonPropertyName("errorCode")]
  public string ErrorCode { get; set; } = "";
  [JsonPropertyName("message")]
  public string Message { get; set; } = "Successfully";

  public static ApiResponseModel Success<T>(T data, HttpStatusCode statusCode = HttpStatusCode.OK) where T : class
  {
    return new ApiResponseModel
    {
      HttpStatus = statusCode,
      IsSuccess = true,
      Data = data,
    };
  }

  public static ApiResponseModel Error(string errorMsg, HttpStatusCode? statusCode = HttpStatusCode.InternalServerError, string errorCode = "")
  {
    return new ApiResponseModel
    {
      HttpStatus = statusCode,
      IsSuccess = false,
      ErrorCode = errorCode,
      Message = errorMsg,
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
      Message = errorMsg,
      Data = data
    };
  }
}
