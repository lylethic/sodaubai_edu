using server.Application.Dtos;

namespace server.Application.Interfaces
{
    public interface IClassify
    {
        Task<ResponseData<ClassifyDto>> CreateClassify(ClassifyDto model);
        Task<ResponseData<ClassifyDto>> GetClassify(int id);
        Task<ResponseData<List<ClassifyDto>>> GetClassifys();
        Task<ResponseData<ClassifyDto>> DeleteClassify(int id);
        Task<ResponseData<ClassifyDto>> UpdateClassify(int id, ClassifyDto model);
        Task<ResponseData<string>> BulkDelete(List<int> ids);
        Task<ResponseData<string>> ImportExcel(IFormFile file);
    }
}
