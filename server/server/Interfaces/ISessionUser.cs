using server.Types.Auth;

namespace server.Interfaces
{
  public interface ISessionUser
  {
    /// <summary>
    /// Đối tượng chứa toàn bộ thông tin cơ bản của user hiện tại từ JWT Claims.
    /// Ví dụ: _sessionUser.CurrentUser.Id
    /// </summary>
    CurrentUser CurrentUser { get; }

    /// <summary>
    /// Lấy trực tiếp UserId dạng int? (null nếu chưa đăng nhập hoặc không có claim)
    /// </summary>
    int? UserId { get; }

    /// <summary>
    /// Lấy Email của user
    /// </summary>
    string? Email { get; }

    /// <summary>
    /// Lấy SchoolId của user dạng int?
    /// </summary>
    int? SchoolId { get; }

    /// <summary>
    /// Lấy RoleId của user dạng int?
    /// </summary>
    int? RoleId { get; }

    /// <summary>
    /// Danh sách Roles của user
    /// </summary>
    List<string> Roles { get; }

    /// <summary>
    /// Kiểm tra user đã được xác thực (Authenticated) hay chưa
    /// </summary>
    bool IsAuthenticated { get; }

    /// <summary>
    /// Lấy giá trị bất kỳ Claim nào theo tên ClaimType
    /// </summary>
    string? GetClaim(string claimType);
  }
}
