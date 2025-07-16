using System.Net;
using Asp.Versioning;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using server.Common.Filter;
using server.Common.Models;

namespace server.Common.Settings;

[ApiController]
[Route("api/[controller]")]
[TypeFilter(typeof(AuthorizationFilterAttribute))]
public abstract class BaseApiController : ControllerBase
{
    protected Common.Interfaces.ILogger _logger;
    protected IMapper _mapper;
    protected readonly IHttpContextAccessor _httpContextAccessor;

    public BaseApiController()
    {
    }

    protected IActionResult Success(object result)
    {
        return Ok(ApiResponseModel.Success(result));
    }

    protected IActionResult Error(string message)
    {
        return Ok(ApiResponseModel.Error(message));
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
