using AutoMapper;
using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Dtos;
using server.IService;
using server.Models;
using server.Types;
using server.Types.Account;
using System.Data;
using System.Text;
using System.Text.RegularExpressions;

namespace server.Repositories
{
  public class AccountRespositories : IAccount
  {
    private readonly Data.SoDauBaiContext _context;
    private readonly IAuth _auth;
    private readonly IMapper _map;

    public AccountRespositories(Data.SoDauBaiContext context, IMapper map, IAuth auth)
    {
      _context = context;
      _map = map;
      _auth = auth;
    }

    private static bool IsValidEmail(string email)
    {
      var regex = @"^[\w\.-]+@gmail\.com$";
      return Regex.IsMatch(email, regex);
    }

    public async Task<AccountsResType> CreateAccount(RegisterDto acc)
    {
      try
      {
        if (!IsValidEmail(acc.Email))
        {
          return new AccountsResType
          {
            Message = "Lỗi xảy ra khi xác thực dữ liệu...",
            Errors = new List<Error>
            {
                new Error("Email", "Email sai định dạng")
            },
            StatusCode = 422,
            IsSuccess = false
          };
        }

        var query = "SELECT * FROM ACCOUNT WHERE Email = @email";

        var account = await _context.Accounts
            .FromSqlRaw(query, new SqlParameter("@email", acc.Email))
            .FirstOrDefaultAsync();

        if (account != null)
        {
          return new AccountsResType
          {
            Message = "Lỗi xảy ra khi xác thực dữ liệu...",
            Errors = new List<Error>
            {
                new Error("Email", "Email đã được đăng ký")
            },
            StatusCode = 409,
            IsSuccess = false
          };

        }

        // Hash the password
        byte[] passwordHash, passwordSalt;
        _auth.GenerateHash(acc.Password, out passwordHash, out passwordSalt);

        /*
         The SCOPE_IDENTITY() function is used to return the ID of the newly inserted row,
         which is crucial for getting the AccountId after the insertion.
        */
        string sqlInsert = @"
            INSERT INTO Account (Email, RoleId, SchoolId, matKhau, PasswordSalt, DateCreated, DateUpdated)
            VALUES (@Email, @RoleId, @SchoolId, @matKhau, @PasswordSalt, @DateCreated, @DateUpdated);
            SELECT CAST(SCOPE_IDENTITY() as int);
        ";

        acc.DateCreated = DateTime.UtcNow;
        acc.DateUpdated = null;

        var accountId = await _context.Database.ExecuteSqlRawAsync(sqlInsert,
            new SqlParameter("@Email", acc.Email),
            new SqlParameter("@RoleId", acc.RoleId),
            new SqlParameter("@SchoolId", acc.SchoolId),
            new SqlParameter("@matKhau", passwordHash),
            new SqlParameter("@PasswordSalt", passwordSalt),
            new SqlParameter("@DateCreated", acc.DateCreated),
            new SqlParameter("@DateUpdated", DBNull.Value)
        );

        var accountAddResType = new AccountAddBody
        {
          RoleId = acc.RoleId,
          SchoolId = acc.SchoolId,
          Email = acc.Email,
          DateCreated = acc.DateCreated,
          DateUpdated = acc.DateUpdated,
        };

        return new AccountsResType(200, "Thành công", accountAddResType);
      }
      catch (Exception ex)
      {
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> GetAccount(int id)
    {
      try
      {
        var query = @"SELECT
                            acc.AccountId, acc.RoleId, acc.SchoolId, acc.Email, 
                            tea.TeacherId, tea.Fullname, tea.Status
                        FROM Account as acc 
                        LEFT JOIN Teacher as tea ON acc.AccountId = tea.AccountId
                        WHERE acc.AccountId = @id";

        var account = await _context.Accounts
            .FromSqlRaw(query, new SqlParameter("@id", id))
            .Select(acc => new AccountDto
            {
              AccountId = acc.AccountId,
              RoleId = acc.RoleId,
              SchoolId = acc.SchoolId,
              Email = acc.Email,
              Teacher = acc.Teachers.Select(tea => new TeacherDto
              {
                TeacherId = tea.TeacherId,
                Fullname = tea.Fullname,
                Status = tea.Status
              }).FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (account is null)
        {
          return new AccountsResType(404, "Không tìm thấy tài khoản");
        }

        var result = new AccountResData
        {
          AccountId = account.AccountId,
          RoleId = account.RoleId,
          SchoolId = account.SchoolId,
          Email = account.Email,
          TeacherId = account.Teacher?.TeacherId ?? 0,
          FullName = account.Teacher?.Fullname,
          StatusTeacher = account.Teacher?.Status
        };

        return new AccountsResType(200, "Success", result);
      }
      catch (Exception ex)
      {
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> GetAccountById(int id)
    {
      try
      {
        var query = @"SELECT * FROM Account as acc WHERE acc.AccountId = @id";

        var account = await _context.Accounts
            .FromSqlRaw(query, new SqlParameter("@id", id))
            .Select(acc => new AccountData
            {
              AccountId = acc.AccountId,
              RoleId = acc.RoleId,
              SchoolId = acc.SchoolId,
              Email = acc.Email,
              Password = acc.PasswordSalt
            })
            .FirstOrDefaultAsync();

        if (account is null)
        {
          return new AccountsResType(404, "Không tìm thấy tài khoản");
        }

        return new AccountsResType(200, "Thành công", account);
      }
      catch (Exception ex)
      {
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> GetAccounts(int? schoolId)
    {
      try
      {
        var accountsQuery = from account in _context.Accounts
                            join role in _context.Roles on account.RoleId equals role.RoleId into roleGroup
                            from role in roleGroup.DefaultIfEmpty()
                            join school in _context.Schools on account.SchoolId equals school.SchoolId into schoolGroup
                            from school in schoolGroup.DefaultIfEmpty()
                            where schoolId == null || account.SchoolId == schoolId
                            select new AccountsResData
                            {
                              AccountId = account.AccountId,
                              RoleId = account.RoleId,
                              SchoolId = account.SchoolId,
                              RoleName = role.NameRole,
                              SchoolName = school.NameSchool,
                              Email = account.Email,
                              DateCreated = account.DateCreated,
                              DateUpdated = account.DateUpdated
                            };

        // Apply pagination
        var pagedAccounts = await accountsQuery
                            .AsNoTracking()
                            .OrderBy(a => a.AccountId)
                            .ToListAsync();

        if (pagedAccounts == null || pagedAccounts.Count == 0)
        {
          return new AccountsResType(404, "Không tìm thấy danh sách tài khoản");
        }

        return new AccountsResType(200, "Thành công", pagedAccounts);
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error occurred: {ex.Message}, Inner Exception: {ex.InnerException?.Message}");
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> GetAccountsBySchoolId(QueryObjects? queryObject)
    {
      try
      {
        queryObject ??= new QueryObjects();
        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

        // Use LINQ to join tables and select specific columns
        var accountsQuery = from account in _context.Accounts
                            join role in _context.Roles on account.RoleId equals role.RoleId into roleGroup
                            from role in roleGroup.DefaultIfEmpty()
                            join school in _context.Schools on account.SchoolId equals school.SchoolId into schoolGroup
                            from school in schoolGroup.DefaultIfEmpty()
                            select new AccountsResData
                            {
                              AccountId = account.AccountId,
                              RoleId = account.RoleId,
                              SchoolId = account.SchoolId,
                              RoleName = role.NameRole,
                              SchoolName = school.NameSchool,
                              Email = account.Email,
                              DateCreated = account.DateCreated,
                              DateUpdated = account.DateUpdated
                            };

        // Apply pagination
        var pagedAccounts = await accountsQuery
                            .AsNoTracking()
                            .Where(x => x.SchoolId == queryObject.SchoolId)
                            .OrderBy(a => a.AccountId)
                            .Skip(skip)
                            .Take(queryObject.PageSize)
                            .ToListAsync();

        if (pagedAccounts == null || pagedAccounts.Count == 0)
        {
          return new AccountsResType(404, "Không tìm thấy danh sách tài khoản");
        }
        return new AccountsResType(200, "Thành công", pagedAccounts);
      }
      catch (Exception ex)
      {
        Console.WriteLine($"Error occurred: {ex.Message}, Inner Exception: {ex.InnerException?.Message}");
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> GetAccountsByRole(int? roleId, int? schoolId)
    {
      try
      {
        var query = @"SELECT * FROM ACCOUNT 
                      WHERE (@roleId IS NULL OR RoleId = @roleId)
                        AND (@schoolId IS NULL OR SchoolId = @schoolId)
                      ORDER BY EMAIL";

        var roleIdParam = roleId.HasValue
          ? new SqlParameter("@roleId", roleId)
          : new SqlParameter("@roleId", DBNull.Value);

        var schoolIdParam = schoolId.HasValue
                 ? new SqlParameter("@schoolId", schoolId)
                 : new SqlParameter("@schoolId", DBNull.Value);

        var accsList = await _context.Accounts
            .FromSqlRaw(query, roleIdParam, schoolIdParam)
            .ToListAsync() ?? throw new Exception("Empty");

        var result = accsList.Select(acc => new AccountDto
        {
          AccountId = acc.AccountId,
          RoleId = acc.RoleId,
          SchoolId = acc.SchoolId,
          Email = acc.Email
        }).ToList();

        if (result is null || result.Count == 0)
        {
          return new AccountsResType(404, $"Vai trò mã số {roleId} và trường học mã số {schoolId} không có tài khoản nào.");
        }

        return new AccountsResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> UpdateAccount(int accountId, AccountBody model)
    {
      try
      {
        if (!IsValidEmail(model.Email))
        {
          return new AccountsResType(400, "Định dạng không hợp lệ");
        }

        var query = "SELECT * FROM ACCOUNT WHERE AccountId = @accountId";

        var existingAccount = await _context.Accounts
          .FromSqlRaw(query, new SqlParameter("@accountId", accountId))
          .FirstOrDefaultAsync();

        if (existingAccount is null)
        {
          return new AccountsResType(404, "Không tìm thấy tài khoản");
        }

        bool hasChanges = false;

        var queryBuilder = new StringBuilder("UPDATE Account SET ");
        var parameters = new List<SqlParameter>();

        if (!string.IsNullOrEmpty(model.Email) && model.Email != existingAccount.Email)
        {
          queryBuilder.Append("Email = @Email, ");
          parameters.Add(new SqlParameter("@Email", model.Email));
          hasChanges = true;
        }

        if (model.RoleId != 0 && model.RoleId != existingAccount.RoleId)
        {
          queryBuilder.Append("RoleId = @RoleId, ");
          parameters.Add(new SqlParameter("@RoleId", model.RoleId));
          hasChanges = true;
        }

        if (model.SchoolId != 0 && model.SchoolId != existingAccount.SchoolId)
        {
          queryBuilder.Append("SchoolId = @SchoolId, ");
          parameters.Add(new SqlParameter("@SchoolId", model.SchoolId));
          hasChanges = true;
        }

        if (model.DateCreated.HasValue)
        {
          queryBuilder.Append("DateCreated = @DateCreated, ");
          parameters.Add(new SqlParameter("@DateCreated", model.DateCreated.Value));
          hasChanges = true;
        }

        var currentDate = DateTime.UtcNow;
        if (currentDate != model.DateUpdated)
        {
          queryBuilder.Append("DateUpdated = @DateUpdated, ");
          parameters.Add(new SqlParameter("@DateUpdated", currentDate));
          hasChanges = true;
        }

        if (hasChanges)
        {
          queryBuilder.Length -= 2;

          queryBuilder.Append(" WHERE AccountId = @accountId");
          parameters.Add(new SqlParameter("@accountId", accountId));

          // Execute the update query
          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          return new AccountsResType(200, "Đã cập nhật thành công");

        }
        else
        {
          return new AccountsResType(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> DeleteAccount(int accountId)
    {
      try
      {
        // Find account
        string findAccount = "SELECT * FROM Account WHERE AccountId = @accountId";
        var account = await _context.Accounts
          .FromSqlRaw(findAccount, new SqlParameter("@accountId", accountId))
          .FirstOrDefaultAsync();

        // Check account null??
        if (account is null)
        {
          return new AccountsResType(404, "Không tìm thấy tài khoản");
        }

        // Delete query
        var deleteQuery = "DELETE FROM Account WHERE AccountId = @accountId";
        await _context.Database
          .ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@accountId", accountId));

        return new AccountsResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> ImportExcel(IFormFile file)
    {
      try
      {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        if (file is not null && file.Length > 0)
        {
          var uploadsFolder = $"{Directory.GetCurrentDirectory()}\\Uploads";

          if (!Directory.Exists(uploadsFolder))
          {
            Directory.CreateDirectory(uploadsFolder);
          }

          var filePath = Path.Combine(uploadsFolder, file.FileName);
          using (var stream = new FileStream(filePath, FileMode.Create))
          {
            await file.CopyToAsync(stream);
          }

          using (var stream = System.IO.File.Open(filePath, FileMode.Open, FileAccess.Read))
          {
            using var reader = ExcelReaderFactory.CreateReader(stream);
            bool isHeaderSkipped = false;

            do
            {
              while (reader.Read())
              {
                if (!isHeaderSkipped)
                {
                  isHeaderSkipped = true;
                  continue;
                }

                // Check if there are no more rows or empty rows
                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null && reader.GetValue(4) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var accountDto = new Dtos.RegisterDto
                {
                  RoleId = Convert.ToInt16(reader.GetValue(1)),
                  SchoolId = Convert.ToInt16(reader.GetValue(2)),
                  Email = reader.GetValue(3).ToString() ?? "email",
                  Password = reader.GetValue(4)?.ToString() ?? string.Empty,
                  DateCreated = DateTime.UtcNow,
                  DateUpdated = null
                };

                if (!IsValidEmail(accountDto.Email))
                {
                  continue;
                }

                var query = "SELECT * FROM ACCOUNT WHERE Email = @email";

                var existingAccount = await _context.Accounts
                    .FromSqlRaw(query, new SqlParameter("@email", accountDto.Email))
                    .FirstOrDefaultAsync();

                if (existingAccount is not null)
                {
                  // Skip account if it already exists
                  continue;
                  throw new Exception("Email already exists");
                }

                // Hash the password
                byte[] passwordHash, passwordSalt;
                _auth.GenerateHash(accountDto.Password, out passwordHash, out passwordSalt);

                var newAccount = new Account
                {
                  RoleId = accountDto.RoleId,
                  SchoolId = accountDto.SchoolId,
                  Email = accountDto.Email,
                  MatKhau = passwordHash,
                  PasswordSalt = passwordSalt,
                  DateCreated = accountDto.DateCreated,
                  DateUpdated = accountDto.DateUpdated,
                };


                await _context.Accounts.AddAsync(newAccount);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new AccountsResType(200, "Thêm mới dữ liệu thành công");
        }
        return new AccountsResType(400, "No file uploaded");

      }
      catch (Exception ex)
      {
        return new AccountsResType(500, $"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<AccountsResType> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new AccountsResType(400, "No IDs provided.");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM Account WHERE AccountId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new AccountsResType(404, "Không tìm thấy");
        }

        await transaction.CommitAsync();

        return new AccountsResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<AccountsResType> RelativeSearchAccounts(QueryObjects? queryObject)
    {
      try
      {
        queryObject ??= new QueryObjects();

        var query = _context.Accounts
          .AsNoTracking()
          .Include(t => t.Teachers)
          .Include(x => x.Role)
          .Include(x => x.School)
          .AsQueryable();


        if (queryObject.SchoolId.HasValue)
        {
          query = query.Where(x => x.SchoolId == queryObject.SchoolId.Value);
        }

        if (queryObject.RoleId.HasValue)
        {
          query = query.Where(x => x.RoleId == queryObject.RoleId.Value);
        }

        if (!string.IsNullOrEmpty(queryObject.Name))
        {
          var searchTerm = queryObject.Name.ToLower();
          query = query.Where(x =>
              EF.Functions.Like(x.Email.ToLower(), $"%{searchTerm}%") ||
              x.Teachers.Any(t => EF.Functions.Like(t.Fullname.ToLower(), $"%{searchTerm}%")));
        }

        var results = await query
          .Select(account => new AccountsResData
          {
            AccountId = account.AccountId,
            RoleId = account.RoleId,
            SchoolId = account.SchoolId,
            RoleName = account.Role.NameRole,
            SchoolName = account.School.NameSchool,
            Email = account.Email,
            DateCreated = account.DateCreated,
            DateUpdated = account.DateUpdated
          })
          .ToListAsync();

        if (results.Count == 0)
        {
          return new AccountsResType(404, "Không có kết quả");
        }

        return new AccountsResType(200, "Thành công", results);
      }
      catch (Exception ex)
      {
        return new AccountsResType(500, "Có lỗi xảy ra tại máy chủ. Vui lòng liên hệ quản trị viên để sớm khắc phục");
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<int> GetCountAccounts()
    {
      try
      {
        var accounts = await _context.Accounts.CountAsync();
        return accounts;
      }
      catch (Exception ex)
      {
        throw new Exception($"Error: {ex.Message}");
      }
    }

    public async Task<int> GetCountAccountsBySchool(int schoolId)
    {
      try
      {
        var accounts = await _context.Accounts
          .Where(x => x.SchoolId == schoolId)
          .CountAsync();

        if (accounts == 0)
        {
          throw new Exception($"This schoolId {schoolId} doesn't have any accounts");
        }

        return accounts;
      }
      catch (Exception ex)
      {
        throw new Exception($"Error: {ex.Message}");
      }
    }
  }
}
