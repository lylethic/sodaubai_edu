using server.Application.Dtos;
using server.Types.Semester;

namespace server.Application.Interfaces
{
    public interface ISemester
    {
        Task<ResponseData<SemesterDto>> CreateSemester(SemesterDto model);

        Task<ResponseData<SemesterResData>> GetSemester(int id);

        Task<ResponseData<List<SemesterResData>>> GetSemesters();

        Task<ResponseData<SemesterDto>> DeleteSemester(int id);

        Task<ResponseData<SemesterDto>> UpdateSemester(int id, SemesterDto model);

        Task<ResponseData<string>> BulkDelete(List<int> ids);

        Task<ResponseData<string>> ImportExcelFile(IFormFile file);
    }
}
