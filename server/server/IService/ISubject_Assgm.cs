using server.Dtos;

namespace server.IService
{
  public interface ISubject_Assgm
  {
    Task<ResponseData<SubjectAssgmDto>> CreateSubjectAssgm(SubjectAssgmDto model);
    Task<ResponseData<SubjectAssgmDetail>> GetSubjectAssgm(int id);
    Task<ResponseData<SubjectAssgmDto>> GetSubjectAssgmToUpdate(int id);
    Task<ResponseData<List<SubjectAssgmDetail>>> GetSubjectAssgms();
    Task<ResponseData<SubjectAssgmDetail>> GetTeacherBySubjectAssgm(int id);
    Task<ResponseData<SubjectAssgmDto>> DeleteSubjectAssgm(int id);
    Task<ResponseData<SubjectAssgmDto>> UpdateSubjectAssgm(int id, SubjectAssgmDto model);
    Task<ResponseData<string>> BulkDelete(List<int> ids);
    Task<ResponseData<string>> ImportExcel(IFormFile file);
  }
}
