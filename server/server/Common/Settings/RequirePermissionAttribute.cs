using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using server.Interfaces;

namespace server.Common.Settings;

public class RequirePermissionAttribute : Attribute, IAuthorizationFilter
{
  private readonly string[] _permissions;

  public RequirePermissionAttribute(params string[] permission)
  {
    _permissions = permission;
  }

  public void OnAuthorization(AuthorizationFilterContext context)
  {
    var user = context.HttpContext.User;
    if (!user.Identity.IsAuthenticated)
    {
      context.Result = new UnauthorizedResult();
      return;
    }

    var permissionService = context.HttpContext.RequestServices.GetService<IPermission>();
    if (permissionService == null)
    {
      context.Result = new UnauthorizedResult();
      return;
    }

    try
    {
      var userPermissions = GetPermissionsFromRoles(user, permissionService);

      if (_permissions.Any(p => userPermissions.Contains(p)))
      {
        return;
      }

      context.Result = new ForbidResult();
    }
    catch
    {
      context.Result = new UnauthorizedResult();
    }
  }

  private static List<string> GetPermissionsFromRoles(ClaimsPrincipal user, IPermission permService)
  {
    var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();
    if (roles.Count == 0) return [];

    var permissions = new HashSet<string>();
    foreach (var role in roles)
    {
      var rolePermissions = permService.GetPermissionsByRoleAsync(role).Result;
      foreach (var perm in rolePermissions)
        permissions.Add(perm.Name);
    }
    return [.. permissions];
  }
}
