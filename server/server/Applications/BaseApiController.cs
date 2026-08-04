using System;
using System.Net;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Interfaces;

namespace server.Applications;

[ApiController]
[CustomAuthorize]
public abstract class BaseApiController : ControllerBase
{
  protected ILogManager _logger;
  protected IMapper _mapper;
  protected readonly IHttpContextAccessor? _httpContextAccessor;

  protected BaseApiController(
      IMapper mapper,
      IHttpContextAccessor? httpContextAccessor = null,
      ILogManager? logger = null)
  {
    _mapper = mapper;
    _httpContextAccessor = httpContextAccessor;
    _logger = logger ?? throw new Exception("Logger is required");
  }

  protected IActionResult Success(object result)
  {
    return Ok(ApiResponseModel.Success(result));
  }

  protected IActionResult Error(string message, HttpStatusCode? httpStatus = HttpStatusCode.InternalServerError)
  {
    return Ok(ApiResponseModel.Error(message, httpStatus));
  }

  protected IActionResult CreatedSuccess(object result)
  {
    return Created(Request.Path, ApiResponseModel.Success(result, HttpStatusCode.Created));
  }

  protected IActionResult ErrorWithData(object result, string errorMsg)
  {
    return Ok(ApiResponseModel.ErrorWithData(result, errorMsg));
  }
}

