using Microsoft.AspNetCore.Mvc;

namespace SoDauBai.Api.Filters;

public class CustomAuthorizeAttribute : TypeFilterAttribute
{
    public CustomAuthorizeAttribute() : base(typeof(AuthorizationFilter))
    {
    }
}
