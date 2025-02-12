using ClosedXML.Excel;
using ExcelDataReader;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Dtos;
using server.IService;
using server.Types.ChiTietSoDauBai;
using server.Types.Week;
using System.Text;

namespace server.Repositories
{
  public class ChiTietSoDauBaiRepositories : IChiTietSoDauBai
  {
    private readonly SoDauBaiContext _context;

    public ChiTietSoDauBaiRepositories(SoDauBaiContext context)
    {
      this._context = context;
    }

    public async Task<ChiTietSoDauBaiResType> CreateChiTietSoDauBai(ChiTietSoDauBaiDto model)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        // Tim bIa so dau bai ton tai khong?
        var findBia = "SELECT * FROM BiaSoDauBai WHERE BiaSoDauBaiId = @id";

        var existingBia = await _context.BiaSoDauBais
          .FromSqlRaw(findBia, new SqlParameter("@id", model.BiaSoDauBaiId))
          .FirstOrDefaultAsync();

        if (existingBia is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id bìa sổ đầu bài");
        }

        // Tim semster ton tai khong?
        var findSemester = "SELECT * FROM Semester WHERE SemesterId = @id";

        var existingSemester = await _context.Semesters
          .FromSqlRaw(findSemester, new SqlParameter("@id", model.SemesterId))
          .FirstOrDefaultAsync();

        if (existingSemester is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id học kỳ");
        }

        // Tim Week ton tai khong?
        var findWeek = "SELECT * FROM Week WHERE WeekId = @id";

        var existingWeek = await _context.Weeks
          .FromSqlRaw(findWeek, new SqlParameter("@id", model.WeekId))
          .FirstOrDefaultAsync();

        if (existingWeek is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id tuần học");
        }

        // Tim Mon hoc ton tai khong?
        var findSubject = "SELECT * FROM Subject WHERE SubjectId = @id";

        var existingSubject = await _context.Subjects
          .FromSqlRaw(findSubject, new SqlParameter("@id", model.SubjectId))
          .FirstOrDefaultAsync();

        if (existingSubject is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id môn học");
        }

        // Tim Xep loai ton tai khong?
        var findXepLoai = "SELECT * FROM Classification WHERE ClassificationId = @id";

        var existingXepLoai = await _context.Classifications
          .FromSqlRaw(findXepLoai, new SqlParameter("@id", model.ClassificationId))
          .FirstOrDefaultAsync();

        if (existingXepLoai is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id xếp loại");
        }

        var find = "SELECT * FROM ChiTietSodauBai WHERE ChiTietSodauBaiId = @id";

        var existingChiTietSoDauBai = await _context.ChiTietSoDauBais
         .FromSqlRaw(find, new SqlParameter("@id", model.ChiTietSoDauBaiId))
         .FirstOrDefaultAsync();

        var insertdata = @"INSERT INTO ChiTietSoDauBai (biaSoDauBaiId, semesterId, weekId, subjectId, 
                                    classificationId, daysOfTheWeek, thoiGian, buoiHoc, 
                                    tietHoc, lessonContent, attend,
                                    noteComment, createdBy, createdAt, updatedAt)
                           VALUES (@biaSoDauBaiId, @semesterId, @weekId, @subjectId, 
                                    @classificationId, @daysOfTheWeek, @thoiGian, 
                                    @buoiHoc, @tietHoc, @lessonContent, @attend,
                                    @noteComment, @createdBy, @createdAt, @updatedAt);
                           SELECT CAST(SCOPE_IDENTITY() AS int);";

        var currentDate = DateTime.UtcNow;

        var insertChiTietSoDauBai = await _context.Database.ExecuteSqlRawAsync(insertdata,
          new SqlParameter("@biaSoDauBaiId", model.BiaSoDauBaiId),
          new SqlParameter("@semesterId", model.SemesterId),
          new SqlParameter("@weekId", model.WeekId),
          new SqlParameter("@subjectId", model.SubjectId),
          new SqlParameter("@classificationId", model.ClassificationId),
          new SqlParameter("@daysOfTheWeek", model.DaysOfTheWeek),
          new SqlParameter("@thoiGian", model.ThoiGian),
          new SqlParameter("@buoiHoc", model.BuoiHoc),
          new SqlParameter("@tietHoc", model.TietHoc),
          new SqlParameter("@lessonContent", model.LessonContent),
          new SqlParameter("@attend", model.Attend),
          new SqlParameter("@noteComment", model.NoteComment),
          new SqlParameter("@createdBy", model.CreatedBy),
          new SqlParameter("@createdAt", currentDate),
          new SqlParameter("@updatedAt", DBNull.Value)
          );

        var result = new ChiTietSoDauBaiDto
        {
          ChiTietSoDauBaiId = model.ChiTietSoDauBaiId,
          BiaSoDauBaiId = model.BiaSoDauBaiId,
          SemesterId = model.SemesterId,
          WeekId = model.WeekId,
          SubjectId = model.SubjectId,
          ClassificationId = model.ClassificationId,
          DaysOfTheWeek = model.DaysOfTheWeek,
          ThoiGian = model.ThoiGian,
          BuoiHoc = model.BuoiHoc,
          TietHoc = model.TietHoc,
          LessonContent = model.LessonContent,
          Attend = model.Attend,
          NoteComment = model.NoteComment,
          CreatedBy = model.CreatedBy,
          CreatedAt = model.CreatedAt,
          UpdatedAt = model.UpdatedAt,
        };

        await transaction.CommitAsync();

        return new ChiTietSoDauBaiResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> GetChiTietSoDauBai(int id)
    {
      try
      {
        var find = @"SELECT * FROM CHITIETSODAUBAI WHERE CHITIETSODAUBAIID = @id";

        var chiTietSoDauBai = await _context.ChiTietSoDauBais
          .FromSqlRaw(find, new SqlParameter("@id", id)
          ).FirstOrDefaultAsync();

        if (chiTietSoDauBai is null)
        {
          return new ChiTietSoDauBaiResType(404, "Chi tiet so dau bai not found");
        }

        var result = new ChiTietSoDauBaiDto
        {
          ChiTietSoDauBaiId = chiTietSoDauBai.ChiTietSoDauBaiId,
          BiaSoDauBaiId = chiTietSoDauBai.BiaSoDauBaiId,
          SemesterId = chiTietSoDauBai.SemesterId,
          WeekId = chiTietSoDauBai.WeekId,
          SubjectId = chiTietSoDauBai.SubjectId,
          ClassificationId = chiTietSoDauBai.ClassificationId,
          DaysOfTheWeek = chiTietSoDauBai.DaysOfTheWeek,
          ThoiGian = chiTietSoDauBai.ThoiGian,
          BuoiHoc = chiTietSoDauBai.BuoiHoc,
          TietHoc = chiTietSoDauBai.TietHoc,
          LessonContent = chiTietSoDauBai.LessonContent,
          Attend = chiTietSoDauBai.Attend,
          NoteComment = chiTietSoDauBai.NoteComment,
          CreatedBy = chiTietSoDauBai.CreatedBy,
          CreatedAt = chiTietSoDauBai.CreatedAt,
          UpdatedAt = chiTietSoDauBai.UpdatedAt,
        };

        return new ChiTietSoDauBaiResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    // Get chi tiet so dau bai theo bia, HK, Nam hoc, tuan hoc
    public async Task<ChiTietSoDauBaiResType> GetAllChiTietsByBia(ChiTietSoDauBaiByBiaQuery queryChiTiet)
    {
      try
      {
        var result = from ct in _context.ChiTietSoDauBais
                     join b in _context.BiaSoDauBais on ct.BiaSoDauBaiId equals b.BiaSoDauBaiId into bGroup
                     from b in bGroup.DefaultIfEmpty()
                     join c in _context.Classes on b.ClassId equals c.ClassId into cGroup
                     from c in cGroup.DefaultIfEmpty()
                     join t in _context.Teachers on c.TeacherId equals t.TeacherId into tGroup
                     from t in tGroup.DefaultIfEmpty()
                     where b.AcademicyearId == queryChiTiet.AcademicYearId &&
                           ct.SemesterId == queryChiTiet.SemesterId &&
                           ct.WeekId == queryChiTiet.WeekId &&
                           b.BiaSoDauBaiId == queryChiTiet.BiaSoDauBaiId
                     select new ChiTietSoDauBaiRes
                     {
                       ChiTietSoDauBaiId = ct.ChiTietSoDauBaiId,
                       BiaSoDauBaiId = ct.BiaSoDauBaiId,
                       ClassName = c.ClassName,
                       SemesterId = ct.SemesterId,
                       SemesterName = ct.Semester.SemesterName,
                       WeekId = ct.WeekId,
                       WeekName = ct.Week.WeekName,
                       SubjectId = ct.SubjectId,
                       SubjectName = ct.Subject.SubjectName,
                       ClassificationId = ct.ClassificationId,
                       ClassifyName = ct.Classification.ClassifyName,
                       DaysOfTheWeek = ct.DaysOfTheWeek,
                       ThoiGian = ct.ThoiGian.ToString("dd/MM/yyyy"),
                       BuoiHoc = ct.BuoiHoc,
                       TietHoc = ct.TietHoc,
                       LessonContent = ct.LessonContent,
                       Attend = ct.Attend,
                       NoteComment = ct.NoteComment,
                       CreatedBy = _context.Teachers
                                        .Where(teacher => teacher.TeacherId == ct.CreatedBy)
                                        .Select(teacher => teacher.Fullname)
                                        .FirstOrDefault(),
                       CreatedAt = ct.CreatedAt,
                       UpdatedAt = ct.UpdatedAt,
                     };

        var chitietSoDauBai = await result.AsNoTracking().ToListAsync();

        if (chitietSoDauBai.Count == 0)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy kết quả");
        }

        if (chitietSoDauBai is null)
        {
          return new ChiTietSoDauBaiResType(400, "Không có kết quả");
        }

        return new ChiTietSoDauBaiResType(200, "Thành công", chitietSoDauBai);

      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> GetChiTietSoDauBais(QueryObject? queryObject)
    {
      try
      {
        queryObject ??= new QueryObject();
        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

        var query = @"SELECT * FROM ChiTietSoDauBai
                      ORDER BY ChiTietSoDauBaiId
                      OFFSET @skip ROWS
                      FETCH NEXT @pageSize ROWS ONLY";

        var chiTietSoDauBai = await _context.ChiTietSoDauBais
          .FromSqlRaw(query,
          new SqlParameter("@skip", skip),
          new SqlParameter("@pageSize", queryObject.PageSize)
          ).ToListAsync() ?? throw new Exception("Empty");

        var result = chiTietSoDauBai.Select(x => new ChiTietSoDauBaiDto
        {
          ChiTietSoDauBaiId = x.ChiTietSoDauBaiId,
          BiaSoDauBaiId = x.BiaSoDauBaiId,
          SemesterId = x.SemesterId,
          WeekId = x.WeekId,
          SubjectId = x.SubjectId,
          ClassificationId = x.ClassificationId,
          DaysOfTheWeek = x.DaysOfTheWeek,
          ThoiGian = x.ThoiGian,
          BuoiHoc = x.BuoiHoc,
          TietHoc = x.TietHoc,
          LessonContent = x.LessonContent,
          Attend = x.Attend,
          NoteComment = x.NoteComment,
          CreatedBy = x.CreatedBy,
          CreatedAt = x.CreatedAt,
          UpdatedAt = x.UpdatedAt,
        }).ToList();

        return new ChiTietSoDauBaiResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> GetChiTietSoDauBaisByWeek(QueryObject? queryObject, int weekId)
    {
      try
      {
        queryObject ??= new QueryObject();
        var skip = (queryObject.PageNumber - 1) * queryObject.PageSize;

        var chiTietSoDauBaisByWeekQuery = from chitiet in _context.ChiTietSoDauBais
                                          join week in _context.Weeks on chitiet.WeekId equals week.WeekId into weekGroup
                                          from week in weekGroup.DefaultIfEmpty()
                                          join bia in _context.BiaSoDauBais on chitiet.BiaSoDauBaiId equals bia.BiaSoDauBaiId into biaGroup
                                          from bia in biaGroup.DefaultIfEmpty()
                                          join semester in _context.Semesters on chitiet.SemesterId equals semester.SemesterId into semesterGroup
                                          from semester in semesterGroup.DefaultIfEmpty()
                                          join subject in _context.Subjects on chitiet.SubjectId equals subject.SubjectId into subjectGroup
                                          from subject in subjectGroup.DefaultIfEmpty()
                                          join xepLoai in _context.Classifications on chitiet.ClassificationId equals xepLoai.ClassificationId into xepLoaiGroup
                                          from xepLoai in xepLoaiGroup.DefaultIfEmpty()
                                          select (new ChiTietBody
                                          {
                                            ChiTietSoDauBaiId = chitiet.ChiTietSoDauBaiId,
                                            BiaSoDauBaiId = chitiet.BiaSoDauBaiId,
                                            SemesterId = chitiet.SemesterId,
                                            WeekId = chitiet.WeekId,
                                            SubjectId = chitiet.SubjectId,
                                            ClassificationId = chitiet.ClassificationId,
                                            DaysOfTheWeek = chitiet.DaysOfTheWeek,
                                            ThoiGian = chitiet.ThoiGian,
                                            BuoiHoc = chitiet.BuoiHoc,
                                            TietHoc = chitiet.TietHoc,
                                            LessonContent = chitiet.LessonContent,
                                            Attend = chitiet.Attend,
                                            NoteComment = chitiet.NoteComment,
                                            CreatedBy = chitiet.CreatedBy,
                                            CreatedAt = chitiet.CreatedAt,
                                            UpdatedAt = chitiet.UpdatedAt,
                                            HocKy = semester.SemesterName,
                                            TenTuanHoc = week.WeekName,
                                            MonHoc = subject.SubjectName,
                                            TenLop = bia.Class.ClassName,
                                            XepLoai = xepLoai.ClassifyName
                                          });


        var chiTietSoDauBai = await chiTietSoDauBaisByWeekQuery
          .Where(x => x.WeekId == weekId)
          .OrderBy(x => x.ChiTietSoDauBaiId)
          .Skip(skip)
          .Take(queryObject.PageSize)
          .ToListAsync();

        if (chiTietSoDauBai is null || chiTietSoDauBai.Count == 0)
        {
          return new ChiTietSoDauBaiResType(404, "Không có kết quả");
        }

        return new ChiTietSoDauBaiResType(200, "Thành công", chiTietSoDauBai);
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> UpdateChiTietSoDauBai(int id, ChiTietSoDauBaiDto model)
    {
      using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        // Check if the teacher exists in the database
        var findQuery = "SELECT * FROM ChiTietSoDauBai WHERE ChiTietSoDauBaiId = @id";

        var existingChiTietSoDauBai = await _context.ChiTietSoDauBais
            .FromSqlRaw(findQuery, new SqlParameter("@id", id))
            .FirstOrDefaultAsync();

        if (existingChiTietSoDauBai is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id chi tiết sổ đầu bài");
        }

        bool hasChanges = false;

        // Build update query dynamically based on non-null fields
        var parameters = new List<SqlParameter>();
        var queryBuilder = new StringBuilder("UPDATE ChiTietSoDauBai SET ");

        if (model.BiaSoDauBaiId != 0 && model.BiaSoDauBaiId != existingChiTietSoDauBai.BiaSoDauBaiId)
        {
          queryBuilder.Append("BiaSoDauBaiId = @BiaSoDauBaiId, ");
          parameters.Add(new SqlParameter("@BiaSoDauBaiId", model.BiaSoDauBaiId));
          hasChanges = true;
        }

        if (model.SemesterId != 0 && model.SemesterId != existingChiTietSoDauBai.SemesterId)
        {
          queryBuilder.Append("SemesterId = @SemesterId, ");
          parameters.Add(new SqlParameter("@SemesterId", model.SemesterId));
          hasChanges = true;
        }

        if (model.WeekId != 0 && model.WeekId != existingChiTietSoDauBai.WeekId)
        {
          queryBuilder.Append("WeekId = @WeekId, ");
          parameters.Add(new SqlParameter("@WeekId", model.WeekId));
          hasChanges = true;
        }

        if (model.SubjectId != 0 && model.SubjectId != existingChiTietSoDauBai.SubjectId)
        {
          queryBuilder.Append("SubjectId = @SubjectId, ");
          parameters.Add(new SqlParameter("@SubjectId", model.SubjectId));
          hasChanges = true;
        }

        if (model.ClassificationId != 0 && model.ClassificationId != existingChiTietSoDauBai.ClassificationId)
        {
          queryBuilder.Append("ClassificationId = @ClassificationId, ");
          parameters.Add(new SqlParameter("@ClassificationId", model.ClassificationId));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.DaysOfTheWeek) && model.DaysOfTheWeek != existingChiTietSoDauBai.DaysOfTheWeek)
        {
          queryBuilder.Append("DaysOfTheWeek = @DaysOfTheWeek, ");
          parameters.Add(new SqlParameter("@DaysOfTheWeek", model.DaysOfTheWeek));
          hasChanges = true;
        }

        // if (model.ThoiGian != existingChiTietSoDauBai.ThoiGian)
        // {
        //   queryBuilder.Append("ThoiGian = @ThoiGian, ");
        //   parameters.Add(new SqlParameter("@ThoiGian", model.ThoiGian));
        //   hasChanges = true;
        // }

        if (!String.IsNullOrEmpty(model.BuoiHoc) && model.BuoiHoc != existingChiTietSoDauBai.BuoiHoc)
        {
          queryBuilder.Append("BuoiHoc = @BuoiHoc, ");
          parameters.Add(new SqlParameter("@BuoiHoc", model.BuoiHoc));
          hasChanges = true;
        }

        if (model.TietHoc != 0 && model.TietHoc != existingChiTietSoDauBai.TietHoc)
        {
          queryBuilder.Append("TietHoc = @TietHoc, ");
          parameters.Add(new SqlParameter("@TietHoc", model.TietHoc));
          hasChanges = true;
        }

        if (!string.IsNullOrEmpty(model.LessonContent) && model.LessonContent != existingChiTietSoDauBai.LessonContent)
        {
          queryBuilder.Append("LessonContent = @LessonContent, ");
          parameters.Add(new SqlParameter("@LessonContent", model.LessonContent));
          hasChanges = true;
        }

        if (model.Attend != 0 && model.Attend != existingChiTietSoDauBai.Attend)
        {
          queryBuilder.Append("Attend = @Attend, ");
          parameters.Add(new SqlParameter("@Attend", model.Attend));
          hasChanges = true;
        }

        if (model.NoteComment != existingChiTietSoDauBai.NoteComment)
        {
          queryBuilder.Append("NoteComment = @NoteComment, ");
          parameters.Add(new SqlParameter("@NoteComment", model.NoteComment));
          hasChanges = true;
        }

        if (model.CreatedAt.HasValue)
        {
          queryBuilder.Append("CreatedAt = @CreatedAt, ");
          parameters.Add(new SqlParameter("@CreatedAt", model.CreatedAt.Value));
        }

        var update = DateTime.UtcNow;

        queryBuilder.Append("UpdatedAt = @UpdatedAt, ");
        parameters.Add(new SqlParameter("@UpdatedAt", update));

        if (hasChanges)
        {
          if (queryBuilder[queryBuilder.Length - 2] == ',')
          {
            queryBuilder.Length -= 2;
          }

          queryBuilder.Append(" WHERE ChiTietSoDauBaiId = @id");
          parameters.Add(new SqlParameter("@id", id));

          // Execute the update query
          var updateQuery = queryBuilder.ToString();
          await _context.Database.ExecuteSqlRawAsync(updateQuery, [.. parameters]);

          // Commit the transaction
          await transaction.CommitAsync();
          return new ChiTietSoDauBaiResType(200, "Cập nhật thành công");
        }
        else
        {
          return new ChiTietSoDauBaiResType(200, "Không có sự thay đổi");
        }
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ChiTietSoDauBaiResType(500, $"Server Error: {ex.Message}");
      }
    }

    // Chi tiet Tiet hoc nay ai day?, lop nao?,
    public async Task<ChiTietSoDauBaiResType> GetChiTiet_Bia_Class_Teacher(int chiTietId)
    {
      try
      {
        var find = @"SELECT ct.chiTietSoDauBaiId, 
                            b.biaSoDauBaiId,
                            b.classId, 
                            b.schoolId, 
                            b.academicYearId,
                            c.className, 
                            t.teacherId, 
                            t.fullname
                    FROM dbo.ChiTietSoDauBai as ct
                    LEFT JOIN dbo.BiaSoDauBai as b ON ct.biaSoDauBaiId = b.biaSoDauBaiId 
                    LEFT JOIN dbo.Class as c ON b.classId = c.classId 
                    LEFT JOIN dbo.Teacher as t ON c.teacherId = t.teacherId
                    WHERE ct.chiTietSoDauBaiId = @id";

        var chitietSoDauBai = await _context.ChiTietSoDauBais.FromSqlRaw(find,
        new SqlParameter("@id", chiTietId))
        .Select(ct => new ChiTietAndBiaSoDauBaiRes
        {
          ChiTietSoDauBaiId = ct.ChiTietSoDauBaiId,
          BiaSoDauBaiId = ct.BiaSoDauBaiId,
          SchoolId = ct.BiaSoDauBai.SchoolId,
          ClassId = ct.BiaSoDauBai.ClassId,
          AcademicyearId = ct.BiaSoDauBai.AcademicyearId,
          ClassName = ct.BiaSoDauBai.Class.ClassName,
          TeacherId = ct.BiaSoDauBai.Class.TeacherId,
          TeacherFullName = ct.BiaSoDauBai.Class.Teacher.Fullname
        })
        .FirstOrDefaultAsync();

        if (chitietSoDauBai is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id Chi tiết sổ đầu bài");
        }

        var result = new ChiTietAndBiaSoDauBaiRes
        {
          ChiTietSoDauBaiId = chitietSoDauBai.ChiTietSoDauBaiId,
          BiaSoDauBaiId = chitietSoDauBai.BiaSoDauBaiId,
          SchoolId = chitietSoDauBai.SchoolId,
          ClassId = chitietSoDauBai.ClassId,
          AcademicyearId = chitietSoDauBai.AcademicyearId,
          ClassName = chitietSoDauBai.ClassName,
          TeacherId = chitietSoDauBai.TeacherId,
          TeacherFullName = chitietSoDauBai.TeacherFullName
        };

        return new ChiTietSoDauBaiResType(200, "Thành công", result);
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> GetChiTiet_Week_XepLoai(int weekId)
    {
      try
      {
        var find = @"SELECT 
                      ct.chiTietSoDauBaiId, 
                      ct.weekId, 
                      we.weekName, 
                      we.status, 
                      ct.classificationId, 
                      cla.classifyName, 
                      cla.score,
                      bia.classId
                    FROM dbo.ChiTietSoDauBai as ct 
                    LEFT JOIN dbo.BiaSoDauBai as bia on ct.biaSoDauBaiId = bia.biaSoDauBaiId
                    RIGHT JOIN dbo.Classification as cla
                      ON ct.classificationId = cla.classificationId
                    LEFT JOIN dbo.Week as we
                      ON ct.weekId = we.weekId
                    WHERE ct.weekId = @id";

        var chitietSoDauBai = await _context.ChiTietSoDauBais.FromSqlRaw(find,
        new SqlParameter("@id", weekId))
        .Select(ct => new ChiTiet_WeekResData
        {
          ChiTietSoDauBaiId = ct.ChiTietSoDauBaiId,
          WeekId = ct.WeekId,
          WeekName = ct.Week.WeekName,
          Status = ct.Week.Status,
          XepLoaiId = ct.ClassificationId,
          TenXepLoai = ct.Classification.ClassifyName,
          SoDiem = ct.Classification.Score
        })
        .ToListAsync();

        if (chitietSoDauBai is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id Chi tiết sổ đầu bài");
        }

        return new ChiTietSoDauBaiResType(200, "Thành công", chitietSoDauBai);
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> GetChiTietBySchool(ChiTietSoDauBaiQuery queryChiTiet)
    {
      try
      {
        var result = from ct in _context.ChiTietSoDauBais
                     join b in _context.BiaSoDauBais on ct.BiaSoDauBaiId equals b.BiaSoDauBaiId into bGroup
                     from b in bGroup.DefaultIfEmpty()
                     join c in _context.Classes on b.ClassId equals c.ClassId into cGroup
                     from c in cGroup.DefaultIfEmpty()
                     join t in _context.Teachers on c.TeacherId equals t.TeacherId into tGroup
                     from t in tGroup.DefaultIfEmpty()
                     where b.AcademicyearId == queryChiTiet.AcademicYearId &&
                           ct.SemesterId == queryChiTiet.SemesterId &&
                           b.SchoolId == queryChiTiet.SchoolId &&
                           ct.WeekId == queryChiTiet.WeekId &&
                           b.BiaSoDauBaiId == queryChiTiet.BiaSoDauBaiId
                     select new ChiTietSoDauBaiRes
                     {
                       ChiTietSoDauBaiId = ct.ChiTietSoDauBaiId,
                       BiaSoDauBaiId = ct.BiaSoDauBaiId,
                       ClassName = c.ClassName,
                       SemesterId = ct.SemesterId,
                       SemesterName = ct.Semester.SemesterName,
                       WeekId = ct.WeekId,
                       WeekName = ct.Week.WeekName,
                       SubjectId = ct.SubjectId,
                       SubjectName = ct.Subject.SubjectName,
                       ClassificationId = ct.ClassificationId,
                       ClassifyName = ct.Classification.ClassifyName,
                       DaysOfTheWeek = ct.DaysOfTheWeek,
                       ThoiGian = ct.ThoiGian.ToString("dd/MM/yyyy"),
                       BuoiHoc = ct.BuoiHoc,
                       TietHoc = ct.TietHoc,
                       LessonContent = ct.LessonContent,
                       Attend = ct.Attend,
                       NoteComment = ct.NoteComment,
                       CreatedBy = _context.Teachers
                                        .Where(teacher => teacher.TeacherId == ct.CreatedBy)
                                        .Select(teacher => teacher.Fullname)
                                        .FirstOrDefault(),
                       CreatedAt = ct.CreatedAt,
                       UpdatedAt = ct.UpdatedAt,
                     };

        var chitietSoDauBai = await result.ToListAsync();

        if (chitietSoDauBai.Count == 0)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy kết quả");
        }

        if (chitietSoDauBai is null)
        {
          return new ChiTietSoDauBaiResType(400, "Không có kết quả");
        }

        return new ChiTietSoDauBaiResType(200, "Thành công", chitietSoDauBai);

      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> DeleteChiTietSoDauBai(int id)
    {
      try
      {
        var findChiTietSoDauBai = "SELECT * FROM ChiTietSoDauBai WHERE ChiTietSoDauBaiId = @id";

        var chiTietSoDauBai = await _context.ChiTietSoDauBais
          .FromSqlRaw(findChiTietSoDauBai, new SqlParameter("@id", id))
          .FirstOrDefaultAsync();

        if (chiTietSoDauBai is null)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id Chi tiết sổ đầu bài");
        }

        var deleteQuery = "DELETE FROM ChiTietSoDauBai WHERE ChiTietSoDauBaiId = @id";

        await _context.Database.ExecuteSqlRawAsync(deleteQuery, new SqlParameter("@id", id));

        return new ChiTietSoDauBaiResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> BulkDelete(List<int> ids)
    {
      await using var transaction = await _context.Database.BeginTransactionAsync();

      try
      {
        if (ids is null || ids.Count == 0)
        {
          return new ChiTietSoDauBaiResType(400, "Danh sách id không được cung cấp");
        }

        var idList = string.Join(",", ids);

        var deleteQuery = $"DELETE FROM ChiTietSoDauBai WHERE ChiTietSoDauBaiId IN ({idList})";

        var delete = await _context.Database.ExecuteSqlRawAsync(deleteQuery);

        if (delete == 0)
        {
          return new ChiTietSoDauBaiResType(404, "Không tìm thấy id Chi tiết sổ đầu bài nào để xóa");
        }

        await transaction.CommitAsync();

        return new ChiTietSoDauBaiResType(200, "Xóa thành công");
      }
      catch (Exception ex)
      {
        await transaction.RollbackAsync();
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> ImportExcel(IFormFile file)
    {
      try
      {
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

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

          using (var stream = File.Open(filePath, FileMode.Open, FileAccess.Read))
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
                if (reader.GetValue(1) == null && reader.GetValue(2) == null && reader.GetValue(3) == null
                  && reader.GetValue(4) == null && reader.GetValue(5) == null && reader.GetValue(6) == null
                  && reader.GetValue(7) == null && reader.GetValue(8) == null && reader.GetValue(9) == null
                  && reader.GetValue(10) == null && reader.GetValue(11) == null && reader.GetValue(12) == null
                  && reader.GetValue(13) == null)
                {
                  // Stop processing when an empty row is encountered
                  break;
                }

                var myDetails = new Models.ChiTietSoDauBai
                {
                  BiaSoDauBaiId = Convert.ToInt32(reader.GetValue(1) ?? 0),
                  SemesterId = Convert.ToInt32(reader.GetValue(2) ?? 0),
                  WeekId = Convert.ToInt32(reader.GetValue(3) ?? 0),
                  SubjectId = Convert.ToInt32(reader.GetValue(4) ?? 0),
                  ClassificationId = Convert.ToInt32(reader.GetValue(5) ?? 0),
                  DaysOfTheWeek = reader.GetValue(6)?.ToString() ?? "Thứ",
                  ThoiGian = Convert.ToDateTime(reader.GetValue(7) ?? DateTime.MinValue),
                  BuoiHoc = reader.GetValue(8)?.ToString() ?? "Buổi ",
                  TietHoc = Convert.ToInt32(reader.GetValue(9) ?? 0),
                  LessonContent = reader.GetValue(10)?.ToString() ?? "Nội dung bài học",
                  Attend = Convert.ToInt32(reader.GetValue(11) ?? 0),
                  NoteComment = reader.GetValue(12)?.ToString() ?? "Ghi chú",
                  CreatedBy = Convert.ToInt32(reader.GetValue(13) ?? 0),
                  CreatedAt = DateTime.UtcNow,
                  UpdatedAt = null
                };

                await _context.ChiTietSoDauBais.AddAsync(myDetails);
                await _context.SaveChangesAsync();
              }
            } while (reader.NextResult());
          }

          return new ChiTietSoDauBaiResType(200, "Thêm danh sách bằng excel thành công");
        }

        return new ChiTietSoDauBaiResType(400, "Không có file nào được tải lên");
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Server error: {ex.Message}");
      }
    }

    public async Task<ChiTietSoDauBaiResType> ExportChiTietSoDauBaiToExcel(int weekId, int classId, string filePath)
    {
      try
      {
        // Fetch records filtered by weekId
        var chiTietSoDauBais = await (from chitiet in _context.ChiTietSoDauBais
                                      join week in _context.Weeks on chitiet.WeekId equals week.WeekId into weekGroup
                                      from week in weekGroup.DefaultIfEmpty()
                                      join bia in _context.BiaSoDauBais on chitiet.BiaSoDauBaiId equals bia.BiaSoDauBaiId into biaGroup
                                      from bia in biaGroup.DefaultIfEmpty()
                                      join semester in _context.Semesters on chitiet.SemesterId equals semester.SemesterId into semesterGroup
                                      from semester in semesterGroup.DefaultIfEmpty()
                                      join subject in _context.Subjects on chitiet.SubjectId equals subject.SubjectId into subjectGroup
                                      from subject in subjectGroup.DefaultIfEmpty()
                                      join xepLoai in _context.Classifications on chitiet.ClassificationId equals xepLoai.ClassificationId into xepLoaiGroup
                                      from xepLoai in xepLoaiGroup.DefaultIfEmpty()
                                      where chitiet.WeekId == weekId && bia.ClassId == classId
                                      select new
                                      {
                                        chitiet.ChiTietSoDauBaiId,
                                        chitiet.BiaSoDauBaiId,
                                        chitiet.SemesterId,
                                        chitiet.WeekId,
                                        chitiet.SubjectId,
                                        chitiet.ClassificationId,
                                        chitiet.DaysOfTheWeek,
                                        chitiet.ThoiGian,
                                        chitiet.BuoiHoc,
                                        chitiet.TietHoc,
                                        chitiet.LessonContent,
                                        chitiet.Attend,
                                        chitiet.NoteComment,
                                        chitiet.CreatedBy,
                                        chitiet.CreatedAt,
                                        chitiet.UpdatedAt,
                                        HocKy = semester.SemesterName,
                                        TenTuanHoc = week.WeekName,
                                        MonHoc = subject.SubjectName,
                                        TenLop = bia.Class.ClassName,
                                        XepLoai = xepLoai.ClassifyName
                                      }).ToListAsync();

        if (chiTietSoDauBais == null || !chiTietSoDauBais.Any())
        {
          return new ChiTietSoDauBaiResType(404, "Không có kết quả cho tuần được yêu cầu.");
        }

        using (var workbook = new XLWorkbook())
        {
          var worksheet = workbook.Worksheets.Add("ChiTietSoDauBai");

          // Add headers
          worksheet.Cell(1, 1).Value = "Mã chi tiết sổ đầu bài";
          worksheet.Cell(1, 2).Value = "Lớp";
          worksheet.Cell(1, 3).Value = "Học kỳ";
          worksheet.Cell(1, 4).Value = "Tuần học";
          worksheet.Cell(1, 5).Value = "Môn học";
          worksheet.Cell(1, 6).Value = "Xếp loại";
          worksheet.Cell(1, 7).Value = "Ngày trong tuần";
          worksheet.Cell(1, 8).Value = "Thời gian";
          worksheet.Cell(1, 9).Value = "Buổi học";
          worksheet.Cell(1, 10).Value = "Tiết học";
          worksheet.Cell(1, 11).Value = "Nội dung bài học";
          worksheet.Cell(1, 12).Value = "Sĩ số";
          worksheet.Cell(1, 13).Value = "Ghi chú";
          worksheet.Cell(1, 14).Value = "Ngày tạo";
          worksheet.Cell(1, 15).Value = "Ngày cập nhật";

          // Add data rows
          for (int i = 0; i < chiTietSoDauBais.Count; i++)
          {
            var record = chiTietSoDauBais[i];
            worksheet.Cell(i + 2, 1).Value = record.ChiTietSoDauBaiId;
            worksheet.Cell(i + 2, 2).Value = record.TenLop;
            worksheet.Cell(i + 2, 3).Value = record.HocKy;
            worksheet.Cell(i + 2, 4).Value = record.TenTuanHoc;
            worksheet.Cell(i + 2, 5).Value = record.MonHoc;
            worksheet.Cell(i + 2, 6).Value = record.XepLoai;
            worksheet.Cell(i + 2, 7).Value = record.DaysOfTheWeek;
            worksheet.Cell(i + 2, 8).Value = record.ThoiGian;
            worksheet.Cell(i + 2, 9).Value = record.BuoiHoc;
            worksheet.Cell(i + 2, 10).Value = record.TietHoc;
            worksheet.Cell(i + 2, 11).Value = record.LessonContent;
            worksheet.Cell(i + 2, 12).Value = record.Attend;
            worksheet.Cell(i + 2, 13).Value = record.NoteComment;
            worksheet.Cell(i + 2, 14).Value = record.CreatedAt;
            worksheet.Cell(i + 2, 15).Value = record.UpdatedAt;
          }

          // Adjust column widths
          worksheet.Columns().AdjustToContents();

          // Save the Excel file
          workbook.SaveAs(filePath);
        }

        return new ChiTietSoDauBaiResType(200, "Xuất file Excel thành công.");
      }
      catch (Exception ex)
      {
        return new ChiTietSoDauBaiResType(500, $"Lỗi máy chủ: {ex.Message}");
      }
    }

  }
}
