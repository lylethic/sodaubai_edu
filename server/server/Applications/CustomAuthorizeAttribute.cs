using System;
using Microsoft.AspNetCore.Mvc;

namespace server.Applications;

public class CustomAuthorizeAttribute : TypeFilterAttribute
{
  public CustomAuthorizeAttribute() : base(typeof(AuthorizationFilter))
  {
  }
}
