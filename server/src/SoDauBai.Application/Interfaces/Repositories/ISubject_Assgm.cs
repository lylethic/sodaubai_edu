using SoDauBai.Application.Common.Models;
using SoDauBai.Application.DTOs.Search;
using SoDauBai.Application.DTOs;
using SoDauBai.Domain.Entities;

namespace SoDauBai.Application.Interfaces.Repositories
{
  public interface ISubject_Assgm
  {
    Task<SubjectAssgmDto> AddAsync(SubjectAssgmDto model);
    Task<SubjectAssgmDetail?> GetByIDAsync(int id);
    Task<PaginatedResponse<SubjectAssgmDetail>> GetSubjectAssgms(SubjectAssignmentSearch request);
    Task<SubjectAssgmDetail?> GetTeacherBySubjectAssgm(int id);
    Task<SubjectAssgmDto> UpdateAsync(int id, SubjectAssgmDto model);
    Task<bool> DeleteAsync(int id);
    Task<bool> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcel(IFormFile file);
  }
}


