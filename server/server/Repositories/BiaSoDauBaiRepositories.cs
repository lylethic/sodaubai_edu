using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Types.BiaSoDauBai;
using System.Text;

namespace server.Repositories
{
  public class BiaSoDauBaiRepositories : IBiaSoDauBai
  {
    private readonly SoDauBaiContext _context;

    public BiaSoDauBaiRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<int> CountBiaSoDauBaiAsync()
    {
      try
      {
        var countBiaSoDauBai = await _context.BiaSoDauBais.CountAsync();
        return countBiaSoDauBai;
      }
      catch (Exception ex)
      {
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<int> CountBiaSoDauBaiActiveAsync()
    {
      try
      {
        var countBiaSoDauBai = await _context.BiaSoDauBais.Where(x => x.Status == true).CountAsync();
        return countBiaSoDauBai;
      }
      catch (Exception ex)
      {
        throw new Exception($"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> CreateBiaSoDauBai(BiaSoDauBaiDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        var find = "SELECT * FROM BiaSoDauBai WHERE BiaSoDauBaiId = @id";
        var sodaubai = await _context.BiaSoDauBais
            .FromSqlRaw(find, new SqlParameter("@id", model.BiaSoDauBaiId))
            .FirstOrDefaultAsync();

        if (sodaubai is not null)
        {
          return new BiaSoDauBaiResType(409, "Sổ đầu bài đã tồn tại");
        }

        // Check if schoolId exists
        var schoolExists = await _context.Schools
            .AnyAsync(c => c.SchoolId == model.SchoolId);

        if (!schoolExists)
        {
          return new BiaSoDauBaiResType(404, "Trường học không tồn tại");
        }

        // Check if academicYearId exists
        var academicYearExists = await _context.AcademicYears
            .AnyAsync(c => c.AcademicYearId == model.AcademicyearId);

        if (!academicYearExists)
        {
          return new BiaSoDauBaiResType(404, "Năm học không tồn tại");
        }

        // Check if classId exists
        var classExists = await _context.Classes
            .AnyAsync(c => c.ClassId == model.ClassId);

        if (!classExists)
        {
          return new BiaSoDauBaiResType(404, "Lớp học không tồn tại");
        }

        model.DateCreated = DateTime.UtcNow;
        model.DateUpdated = null;

        var queryInsert = @"INSERT INTO BiaSoDauBai (schoolId, academicYearId, classId, status, dateCreated, dateUpdated)
                                VALUES (@schoolId, @academicYearId, @classId, @status, @dateCreated, @dateUpdated);
                                SELECT CAST(SCOPE_IDENTITY() AS INT);";

        var insert = await _context.Database.ExecuteSqlRawAsync(queryInsert,
            new SqlParameter("@schoolId", model.SchoolId),
            new SqlParameter("@academicYearId", model.AcademicyearId),
            new SqlParameter("@classId", model.ClassId),
            new SqlParameter("@status", model.Status),
            new SqlParameter("@dateCreated", model.DateCreated),
            new SqlParameter("@dateUpdated", DBNull.Value)
        );

        // Commit the transaction after the insert succeeds
        await transaction.CommitAsync();

        var result = new BiaSoDauBaiDto
        {
          BiaSoDauBaiId = insert,
          SchoolId = model.SchoolId,
          AcademicyearId = model.AcademicyearId,
          ClassId = model.ClassId,
          Status = model.Status,
          DateCreated = model.DateCreated,
          DateUpdated = model.DateUpdated,
        };

        return new BiaSoDauBaiResType(200, "Tạo mới sổ đầu bài thành công", result);
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new BiaSoDauBaiResType(500, $"Server Error: {ex.Message}");
      }
    }

    // This method use for fetch and Update
    public async Task<BiaSoDauBaiResType> GetBiaSoDauBai(int id)
    {
      try
      {
        var query = @"SELECT 
                  b.BiaSoDauBaiId,
                  b.SchoolId,
                  ISNULL(s.NameSchool, '') AS SchoolName,
                  b.AcademicyearId,
                  ISNULL(ay.displayAcademicYear_Name, '') AS NienKhoaName,
                  b.ClassId,
                  ISNULL(c.ClassName, '') AS ClassName,
                  b.Status,
                  ISNULL(t.Fullname, '') AS TenGiaoVienChuNhiem,
                  b.DateCreated,
                  b.DateUpdated
              FROM 
                  BiaSoDauBai b
              LEFT JOIN 
                  Class c ON b.ClassId = c.ClassId
              LEFT JOIN 
                  Teacher t ON c.TeacherId = t.TeacherId
              LEFT JOIN 
                  School s ON b.SchoolId = s.SchoolId
              LEFT JOIN 
                  AcademicYear ay ON b.AcademicyearId = ay.AcademicYearId
              WHERE b.BiaSoDauBaiId = @id";

        // Fetch 
        var sodaubai = await _context.BiaSoDauBais
            .FromSqlRaw(query, new SqlParameter("@id", id))
            .Select(static x => new BiaSoDauBaiRes
            {
              BiaSoDauBaiId = x.BiaSoDauBaiId,
              SchoolId = x.SchoolId,
              SchoolName = x.School.NameSchool,
              AcademicyearId = x.AcademicyearId,
              NienKhoaName = x.Academicyear.DisplayAcademicYearName,
              ClassId = x.ClassId,
              ClassName = x.Class.ClassName,
              Status = x.Status,
              TenGiaoVienChuNhiem = x.Class.Teacher.Fullname,
              DateCreated = x.DateCreated.HasValue ? x.DateCreated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
              DateUpdated = x.DateUpdated.HasValue ? x.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
            })
            .FirstOrDefaultAsync();

        if (sodaubai is null)
        {
          return new BiaSoDauBaiResType(404, "Not found");
        }

        // Map the result
        var result = new BiaSoDauBaiRes
        {
          BiaSoDauBaiId = id,
          SchoolId = sodaubai.SchoolId,
          SchoolName = sodaubai.SchoolName ?? string.Empty,
          AcademicyearId = sodaubai.AcademicyearId,
          NienKhoaName = sodaubai.NienKhoaName ?? string.Empty,
          ClassId = sodaubai.ClassId,
          ClassName = sodaubai.ClassName ?? string.Empty,
          Status = sodaubai.Status,
          TenGiaoVienChuNhiem = sodaubai.TenGiaoVienChuNhiem ?? string.Empty,
          DateCreated = sodaubai.DateCreated,
          DateUpdated = sodaubai.DateUpdated,
        };

        return new BiaSoDauBaiResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> GetBiaSoDauBaiToUpdate(int id)
    {
      try
      {
        var query = @"SELECT 
                  b.BiaSoDauBaiId,
                  b.SchoolId,
                  b.AcademicyearId,
                  b.ClassId,
                  b.Status,
                  b.DateCreated,
                  b.DateUpdated
              FROM 
                  BiaSoDauBai b
              WHERE b.BiaSoDauBaiId = @id";

        // Fetch 
        var sodaubai = await _context.BiaSoDauBais
            .FromSqlRaw(query, new SqlParameter("@id", id))
            .FirstOrDefaultAsync();

        if (sodaubai is null)
        {
          return new BiaSoDauBaiResType(404, "Not found");
        }

        // Map the result
        var result = new BiaSoDauBaiDto
        {
          BiaSoDauBaiId = id,
          SchoolId = sodaubai.SchoolId,
          AcademicyearId = sodaubai.AcademicyearId,
          ClassId = sodaubai.ClassId,
          Status = sodaubai.Status,
          DateCreated = sodaubai.DateCreated,
          DateUpdated = sodaubai.DateUpdated,
        };

        return new BiaSoDauBaiResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> GetBiaSoDauBais_Active(QueryObject? queryObject)
    {
      try
      {
        queryObject ??= new QueryObject();
        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

        var baiSoDauBaiQuery = from biaSo in _context.BiaSoDauBais
                               join lop in _context.Classes on biaSo.ClassId equals lop.ClassId into lopHocGroup
                               from lop in lopHocGroup.DefaultIfEmpty()
                               join truong in _context.Schools on biaSo.SchoolId equals truong.SchoolId into schoolGroup
                               from truong in schoolGroup.DefaultIfEmpty()
                               join nienKhoa in _context.AcademicYears on biaSo.AcademicyearId equals nienKhoa.AcademicYearId into nienkhoaGroup
                               from nienKhoa in nienkhoaGroup.DefaultIfEmpty()
                               select new BiaSoDauBaiRes()
                               {
                                 BiaSoDauBaiId = biaSo.BiaSoDauBaiId,
                                 SchoolId = biaSo.SchoolId,
                                 SchoolName = truong.NameSchool,
                                 AcademicyearId = biaSo.AcademicyearId,
                                 NienKhoaName = nienKhoa.DisplayAcademicYearName,
                                 ClassId = biaSo.ClassId,
                                 ClassName = lop.ClassName,
                                 Status = biaSo.Status,
                                 TenGiaoVienChuNhiem = lop.Teacher.Fullname,
                                 DateCreated = biaSo.DateCreated.HasValue ? biaSo.DateCreated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                                 DateUpdated = biaSo.DateUpdated.HasValue ? biaSo.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                               };

        var biaSoDauBai = await baiSoDauBaiQuery
        .AsNoTracking()
            .Where(x => x.Status == true)
            .OrderBy(x => x.BiaSoDauBaiId)
            .Skip(skip)
            .Take(queryObject.PageSize)
            .ToListAsync();

        if (biaSoDauBai is null || biaSoDauBai.Count == 0)
        {
          return new BiaSoDauBaiResType(404, "Không có kết quả");
        }

        return new BiaSoDauBaiResType(200, "Thành công", biaSoDauBai);
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> GetBiaSoDauBaisBySchool_Active(int schoolId)
    {
      try
      {
        if (schoolId is 0)
          return new BiaSoDauBaiResType(400, "Vui lòng nhập mã trường học");

        var baiSoDauBaiQuery = from biaSo in _context.BiaSoDauBais
                               join lop in _context.Classes on biaSo.ClassId equals lop.ClassId into lopHocGroup
                               from lop in lopHocGroup.DefaultIfEmpty()
                               join truong in _context.Schools on biaSo.SchoolId equals truong.SchoolId into schoolGroup
                               from truong in schoolGroup.DefaultIfEmpty()
                               join nienKhoa in _context.AcademicYears on biaSo.AcademicyearId equals nienKhoa.AcademicYearId into nienkhoaGroup
                               from nienKhoa in nienkhoaGroup.DefaultIfEmpty()
                               select new BiaSoDauBaiRes()
                               {
                                 BiaSoDauBaiId = biaSo.BiaSoDauBaiId,
                                 SchoolId = biaSo.SchoolId,
                                 SchoolName = truong.NameSchool,
                                 AcademicyearId = biaSo.AcademicyearId,
                                 NienKhoaName = nienKhoa.DisplayAcademicYearName,
                                 ClassId = biaSo.ClassId,
                                 ClassName = lop.ClassName,
                                 Status = biaSo.Status,
                                 TenGiaoVienChuNhiem = lop.Teacher.Fullname,
                                 DateCreated = biaSo.DateCreated.HasValue ? biaSo.DateCreated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                                 DateUpdated = biaSo.DateUpdated.HasValue ? biaSo.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                               };


        var biaSoDauBai = await baiSoDauBaiQuery
            .Where(x => x.SchoolId.Equals(schoolId) && x.Status == true)
            .AsNoTracking()
            .ToListAsync();

        if (biaSoDauBai is null || biaSoDauBai.Count == 0)
        {
          return new BiaSoDauBaiResType(404, "Không có kết quả");
        }

        return new BiaSoDauBaiResType(200, "Thành công", biaSoDauBai);
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    // status true & false
    public async Task<BiaSoDauBaiResType> GetBiaSoDauBais(QueryObject? queryObject)
    {
      try
      {
        queryObject ??= new QueryObject();
        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

        var baiSoDauBaiQuery = from biaSo in _context.BiaSoDauBais
                               join lop in _context.Classes on biaSo.ClassId equals lop.ClassId into lopHocGroup
                               from lop in lopHocGroup.DefaultIfEmpty()
                               join truong in _context.Schools on biaSo.SchoolId equals truong.SchoolId into schoolGroup
                               from truong in schoolGroup.DefaultIfEmpty()
                               join nienKhoa in _context.AcademicYears on biaSo.AcademicyearId equals nienKhoa.AcademicYearId into nienkhoaGroup
                               from nienKhoa in nienkhoaGroup.DefaultIfEmpty()
                               select new BiaSoDauBaiRes()
                               {
                                 BiaSoDauBaiId = biaSo.BiaSoDauBaiId,
                                 SchoolId = biaSo.SchoolId,
                                 SchoolName = truong.NameSchool,
                                 AcademicyearId = biaSo.AcademicyearId,
                                 NienKhoaName = nienKhoa.DisplayAcademicYearName,
                                 ClassId = biaSo.ClassId,
                                 ClassName = lop.ClassName,
                                 Status = biaSo.Status,
                                 TenGiaoVienChuNhiem = lop.Teacher.Fullname,
                                 DateCreated = biaSo.DateCreated.HasValue ? biaSo.DateCreated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                                 DateUpdated = biaSo.DateUpdated.HasValue ? biaSo.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                               };

        var biaSoDauBai = await baiSoDauBaiQuery
            .OrderBy(x => x.BiaSoDauBaiId)
            .Skip(skip)
            .Take(queryObject.PageSize)
            .ToListAsync();

        if (biaSoDauBai is null || biaSoDauBai.Count == 0)
        {
          return new BiaSoDauBaiResType(404, "Không có kết quả");
        }

        return new BiaSoDauBaiResType(200, "Thành công", biaSoDauBai);
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    // status true & false => admin
    public async Task<BiaSoDauBaiResType> GetBiaSoDauBaisBySchool(QueryObject? queryObject, int schoolId)
    {
      try
      {
        queryObject ??= new QueryObject();
        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

        var baiSoDauBaiQuery = from biaSo in _context.BiaSoDauBais
                               join lop in _context.Classes on biaSo.ClassId equals lop.ClassId into lopHocGroup
                               from lop in lopHocGroup.DefaultIfEmpty()
                               join truong in _context.Schools on biaSo.SchoolId equals truong.SchoolId into schoolGroup
                               from truong in schoolGroup.DefaultIfEmpty()
                               join nienKhoa in _context.AcademicYears on biaSo.AcademicyearId equals nienKhoa.AcademicYearId into nienkhoaGroup
                               from nienKhoa in nienkhoaGroup.DefaultIfEmpty()
                               select new
                               {
                                 biaSo.BiaSoDauBaiId,
                                 biaSo.SchoolId,
                                 truong.NameSchool,
                                 biaSo.AcademicyearId,
                                 nienKhoa.DisplayAcademicYearName,
                                 biaSo.ClassId,
                                 lop.ClassName,
                                 biaSo.Status,
                                 biaSo.DateCreated,
                                 biaSo.DateUpdated,
                                 TenGiaoVienChuNhiem = lop.Teacher.Fullname
                               };

        var rawResults = await baiSoDauBaiQuery
            .Where(x => x.SchoolId.Equals(schoolId))
            .AsNoTracking()
            .Skip(skip)     // Skip the first (pageNumber - 1) * pageSize records
            .Take(queryObject.PageSize) // Take pageSize records
            .ToListAsync();

        var result = rawResults.Select(x => new BiaSoDauBaiRes
        {
          BiaSoDauBaiId = x.BiaSoDauBaiId,
          SchoolId = x.SchoolId,
          SchoolName = x.NameSchool ?? string.Empty,
          AcademicyearId = x.AcademicyearId,
          NienKhoaName = x.DisplayAcademicYearName ?? string.Empty,
          ClassId = x.ClassId,
          ClassName = x.ClassName ?? string.Empty,
          Status = x.Status,
          DateCreated = x.DateCreated.HasValue ? x.DateCreated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
          DateUpdated = x.DateUpdated.HasValue ? x.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
          TenGiaoVienChuNhiem = x.TenGiaoVienChuNhiem
        }).ToList();

        if (result is null || result.Count == 0)
        {
          return new BiaSoDauBaiResType(404, "Không có kết quả");
        }

        return new BiaSoDauBaiResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> GetBiaSoDauBaisBySchoolAndClass(int schoolId, int? classId)
    {
      try
      {
        if (schoolId == 0)
          return new BiaSoDauBaiResType(400, "Vui lòng cung cấp ít nhất mã trường học");

        var baiSoDauBaiQuery = from biaSo in _context.BiaSoDauBais
                               join lop in _context.Classes on biaSo.ClassId equals lop.ClassId into lopHocGroup
                               from lop in lopHocGroup.DefaultIfEmpty()
                               join truong in _context.Schools on biaSo.SchoolId equals truong.SchoolId into schoolGroup
                               from truong in schoolGroup.DefaultIfEmpty()
                               join nienKhoa in _context.AcademicYears on biaSo.AcademicyearId equals nienKhoa.AcademicYearId into nienkhoaGroup
                               from nienKhoa in nienkhoaGroup.DefaultIfEmpty()
                               where biaSo.SchoolId == schoolId &&
                                    (classId == null || biaSo.ClassId == classId)
                               select new BiaSoDauBaiRes()
                               {
                                 BiaSoDauBaiId = biaSo.BiaSoDauBaiId,
                                 SchoolId = biaSo.SchoolId,
                                 SchoolName = truong.NameSchool,
                                 AcademicyearId = biaSo.AcademicyearId,
                                 NienKhoaName = nienKhoa.DisplayAcademicYearName,
                                 ClassId = biaSo.ClassId,
                                 ClassName = lop.ClassName,
                                 Status = biaSo.Status,
                                 TenGiaoVienChuNhiem = lop.Teacher.Fullname,
                                 DateCreated = biaSo.DateCreated.HasValue ? biaSo.DateCreated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                                 DateUpdated = biaSo.DateUpdated.HasValue ? biaSo.DateUpdated.Value.ToString("dd/MM/yyyy HH:mm:ss") : string.Empty,
                               };

        var biaSoDauBai = await baiSoDauBaiQuery
            .OrderBy(x => x.ClassName)
            .AsNoTracking()
            .ToListAsync();

        if (biaSoDauBai is null || biaSoDauBai.Count == 0)
          return new BiaSoDauBaiResType(200, "Không có kết quả");

        return new BiaSoDauBaiResType(200, "Thành công", biaSoDauBai);
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> UpdateBiaSoDauBai(int id, BiaSoDauBaiDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();
      try
      {
        var find = "SELECT * FROM BiaSoDauBai WHERE BiaSoDauBaiId = @id";
        var existingBiaSoDaiBai = await _context.BiaSoDauBais
            .FromSqlRaw(find, new SqlParameter("@id", id))
            .FirstOrDefaultAsync();

        if (existingBiaSoDaiBai == null)
        {
          return new BiaSoDauBaiResType(404, "Mã sổ không tồn tại");
        }

        bool hasChanges = false;

        // Compare if difference
        var parameters = new List<SqlParameter>();
        var queryBuilder = new StringBuilder("UPDATE BiaSoDauBai SET ");

        if (model.SchoolId != 0 && model.SchoolId != existingBiaSoDaiBai.SchoolId)
        {
          queryBuilder.Append("SchoolId = @SchoolId, ");
          parameters.Add(new SqlParameter("@SchoolId", model.SchoolId));
          hasChanges = true;
        }

        if (model.AcademicyearId != 0 && model.AcademicyearId != existingBiaSoDaiBai.AcademicyearId)
        {
          queryBuilder.Append("AcademicyearId = @AcademicyearId, ");
          parameters.Add(new SqlParameter("@AcademicyearId", model.AcademicyearId));
          hasChanges = true;
        }

        if (model.ClassId != 0 && model.ClassId != existingBiaSoDaiBai.ClassId)
        {
          queryBuilder.Append("ClassId = @ClassId, ");
          parameters.Add(new SqlParameter("@ClassId", model.ClassId));
          hasChanges = true;
        }

        if (model.Status != existingBiaSoDaiBai.Status)
        {
          queryBuilder.Append("Status = @Status, ");
          parameters.Add(new SqlParameter("@Status", model.Status));
          hasChanges = true;
        }

        if (model.DateCreated.HasValue)
        {
          queryBuilder.Append("DateCreated = @DateCreated, ");
          parameters.Add(new SqlParameter("@DateCreated", model.DateCreated.Value));
        }

        var currentDate = DateTime.UtcNow;
        if (currentDate != existingBiaSoDaiBai.DateUpdated)
        {
          queryBuilder.Append("DateUpdated = @DateUpdated, ");
          parameters.Add(new SqlParameter("@DateUpdated", currentDate));
          hasChanges = true;
        }

        // Remove the last comma and space
        if (hasChanges)
        {
          queryBuilder.Length -= 2;
          queryBuilder.Append(" WHERE BiaSoDauBaiId = @id");
          parameters.Add(new SqlParameter("@id", id));

          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          // Commit the transaction
          await transaction.CommitAsync();
          return new BiaSoDauBaiResType(200, "Cập nhật thành công");
        }
        else
        {
          return new BiaSoDauBaiResType(200, "Không phát hiện sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        // Rollback the transaction in case of an error
        await transaction.RollbackAsync();
        return new BiaSoDauBaiResType(500, $"Server Error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> DeleteBiaSoDauBai(int id)
    {
      try
      {
        var find = "SELECT * FROM BiaSoDauBai WHERE BiaSoDauBaiId = @id";
        var sodaubai = await _context.BiaSoDauBais
          .FromSqlRaw(find, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (sodaubai is null)
        {
          return new BiaSoDauBaiResType(404, "Không tìm thấy id");
        }

        var deleteQuery = "DELETE FROM BiaSoDauBai WHERE BiaSoDauBaiId = @id";

        var deleteRelatedQuery = "DELETE FROM PhanCongGiangDay WHERE biaSoDauBaiId = @id";

        await _context.Database.ExecuteSqlRawAsync(deleteRelatedQuery, new SqlParameter("@id", id));

        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));
        return new BiaSoDauBaiResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new BiaSoDauBaiResType(400, "Không có mã số nào được cung cấp.");
        }

        var idList = string.Join(",", ids);

        var deleteRelatedQuery = $"DELETE FROM PhanCongGiangDay WHERE BiaSoDauBaiId IN ({idList})";
        await _context.Database.ExecuteSqlRawAsync(deleteRelatedQuery);

        var deleteQuery = $"DELETE FROM BiaSoDauBai WHERE BiaSoDauBaiId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new BiaSoDauBaiResType(404, "Không tìm thấy id");
        }

        await transaction.CommitAsync();

        return new BiaSoDauBaiResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new BiaSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> ImportExcel(IFormFile file)
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
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
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

                  var myBiaSoDauBai = new Models.BiaSoDauBai
                  {
                    SchoolId = Convert.ToInt32(reader.GetValue(1)),
                    AcademicyearId = Convert.ToInt32(reader.GetValue(2)),
                    ClassId = Convert.ToInt32(reader.GetValue(3)),
                    Status = Convert.ToBoolean(reader.GetValue(4)),
                    DateCreated = DateTime.UtcNow,
                    DateUpdated = null
                  };

                  await _context.BiaSoDauBais.AddAsync(myBiaSoDauBai);
                  await _context.SaveChangesAsync();
                }
              } while (reader.NextResult());
            }
          }

          return new BiaSoDauBaiResType(200, "Tải lên thành công");
        }
        return new BiaSoDauBaiResType(400, "Không có file nào được chọn để tải lên");

      }
      catch (Exception ex)
      {
        return new BiaSoDauBaiResType(500, $"Error while uploading file: {ex.Message}");
      }
    }

    public async Task<BiaSoDauBaiResType> SearchBiaSoDauBais(BiaSoDauBaiSearchObject? searchObject)
    {
      searchObject ??= new BiaSoDauBaiSearchObject();

      if (searchObject.ClassId == 0 || searchObject.SchoolId == 0)
      {
        return new BiaSoDauBaiResType(400, "Không tìm thấy kết quả. Vui lòng nhập thông tin tìm kiếm");
      }

      var query = _context.BiaSoDauBais
          .AsNoTracking()
          .Include(x => x.Class)
          .Include(b => b.School)
          .AsQueryable();

      if (searchObject.SchoolId.HasValue)
      {
        query = query.Where(x => x.SchoolId == searchObject.SchoolId.Value);
      }

      if (searchObject.ClassId.HasValue)
      {
        query = query.Where(x => x.ClassId == searchObject.ClassId.Value);
      }

      var rawResults = await query.Select(x => new
      {
        x.BiaSoDauBaiId,
        x.ClassId,
        x.SchoolId,
        x.AcademicyearId,
        SchoolName = x.School.NameSchool,
        ClassName = x.Class.ClassName,
        NienKhoaName = x.Academicyear.DisplayAcademicYearName,
        TenGiaoVienChuNhiem = x.Class.Teacher.Fullname,
        x.Status,
        x.DateCreated,
        x.DateUpdated
      }).ToListAsync();

      var totalCount = query.Count();

      var results = rawResults.Select(x => new BiaSoDauBaiRes
      {
        BiaSoDauBaiId = x.BiaSoDauBaiId,
        SchoolId = x.SchoolId,
        AcademicyearId = x.AcademicyearId,
        ClassId = x.ClassId,
        SchoolName = x.SchoolName,
        ClassName = x.ClassName,
        NienKhoaName = x.NienKhoaName,
        TenGiaoVienChuNhiem = x.TenGiaoVienChuNhiem,
        Status = x.Status,
        DateCreated = x.DateCreated?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty,
        DateUpdated = x.DateUpdated?.ToString("dd/MM/yyyy HH:mm:ss") ?? string.Empty
      }).ToList();

      if (results.Count == 0)
      {
        return new BiaSoDauBaiResType(404, "Không tìm thấy kết quả");
      }
      return new BiaSoDauBaiResType(200, "Có kết quả", results, totalCount);
    }
  }
}
