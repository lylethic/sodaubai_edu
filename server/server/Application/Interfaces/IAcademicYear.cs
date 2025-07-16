using server.Application.Dtos;

namespace server.Application.Interfaces
{
    public interface IAcademicYear
    {
        Task<ResponseData<AcademicYearDto>> CreateAsync(AcademicYearDto model);

        Task<ResponseData<AcademicYearDto>> GetAsync(int id);

        Task<ResponseData<List<AcademicYearDto>>> GetAllAsync();

        Task<ResponseData<AcademicYearDto>> DeleteAsync(int id);

        Task<ResponseData<AcademicYearDto>> UpdateAsync(int id, AcademicYearDto model);

        Task<ResponseData<string>> BulkDeleteAsync(List<int> ids);

        Task<ResponseData<string>> ImportExcel(IFormFile file);
    }
}
