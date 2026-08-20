using server.Data;
using server.Interfaces;
using server.Models;
using server.Dtos;
using server.Applications.ResponseModel;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using server.Common.Exceptions;
using server.Applications.Search;

namespace server.Repositories;

public class UserRepositories : BaseRepository<User>, IUser
{
  private readonly ISessionUser _sessionUser;
  private readonly IMapper _mapper;
  private readonly ISchool _school;
  private readonly IFileUploadService _service;
  public UserRepositories(IFileUploadService service, ISchool school, SoDauBaiContext context, IMapper mapper, ISessionUser sessionUser) : base(context)
  {
    this._sessionUser = sessionUser;
    this._mapper = mapper;
    this._school = school;
    this._service = service;
  }

  protected override IQueryable<User> ApplySearchFilter(IQueryable<User> query, string searchTerm)
  {
    query = query.Where(x => x.Deleted == false);
    if (string.IsNullOrWhiteSpace(searchTerm))
    {
      return query;
    }
    return query.Where(x => x.Email.Contains(searchTerm) || x.Username.Contains(searchTerm));
  }

  public async Task<PaginatedResponse<ExtendUserBody>> GetUsers(UserSearch request)
  {
    var query = _dbSet.Where(x => x.Deleted == false).Include(x => x.School).AsNoTracking().AsQueryable();
    if (request.SchoolId.HasValue)
      query = query.Where(x => x.SchoolId == request.SchoolId);
    var totalCount = await query.CountAsync();
    var skip = (request.PageNumber - 1) * request.PageSize;

    var items = await query.OrderBy(x => x.Id).Skip(skip).Take(request.PageSize).ToListAsync();

    return new PaginatedResponse<ExtendUserBody>
    {
      Items = _mapper.Map<List<User>, List<ExtendUserBody>>(items),
      PageNumber = request.PageNumber,
      PageSize = request.PageSize,
      TotalCount = totalCount
    };
  }

  public async Task<User?> GetUser(int id)
  {
    return await GetByIdAsync(id);
  }

  public async Task<User> AddUser(UserCreateBody model)
  {
    var existingSchool = await _school.GetSchool(model.SchoolId)
      ?? throw new NotFoundException("Không tìm thấy trường học");
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
    var dto = _mapper.Map<UserCreateBody, User>(model);
    string passwordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);
    dto.PasswordHash = passwordHash;
    dto.CreatedBy = _sessionUser.UserId;
    return await base.AddAsync(dto);
  }

  public async Task<User> UpdateUser(int id, User entity)
  {
    entity.Id = id;
    var existing = await GetByIdAsync(id);
    if (existing == null) throw new NotFoundException("Không tìm thấy người dùng");

    if (entity.SchoolId != null && entity.SchoolId != 0) existing.SchoolId = entity.SchoolId;
    if (!string.IsNullOrEmpty(entity.Email)) existing.Email = entity.Email;
    if (!string.IsNullOrEmpty(entity.Username)) existing.Username = entity.Username;
    if (!string.IsNullOrEmpty(entity.Avatar)) existing.Avatar = entity.Avatar;
    if (!string.IsNullOrEmpty(entity.PasswordHash)) existing.PasswordHash = entity.PasswordHash;
    existing.UpdatedBy = _sessionUser.UserId;
    existing.DateUpdated = DateTime.UtcNow;
    return await UpdateAsync(existing);
  }

  public async Task<bool> DeleteUser(int id)
  {
    return await SoftDeleteAsync(id);
  }

  public async Task<User> UploadImageAsync(int id, IFormFile file)
  {
    if (file == null || file.Length == 0)
    {
      throw new BadRequestException("File ảnh không hợp lệ hoặc rỗng.");
    }

    var data = await base.GetByIdAsync(id) ?? throw new NotFoundException("Không tìm thấy người dùng");
    if (!string.IsNullOrWhiteSpace(data.Avatar))
    {
      _service.DeleteFile(data.Avatar);
    }

    var photoPath = await _service.UploadFileAsync(file, "User");

    data.Avatar = photoPath;
    data.DateUpdated = DateTime.UtcNow;
    data.UpdatedBy = _sessionUser.UserId;

    await _context.SaveChangesAsync();
    return data;
  }

  public async Task<User?> GetUserByEmail(string email)
  {
    return await _dbSet.FirstOrDefaultAsync(x => x.Email == email && x.Deleted == false);
  }
}
