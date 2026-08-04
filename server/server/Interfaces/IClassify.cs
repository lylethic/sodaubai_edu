using server.Dtos;

namespace server.IService
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
