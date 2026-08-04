using CloudinaryDotNet.Actions;

namespace server.IService
{
  public interface IPhotoService
  {
    Task<ImageUploadResult> CreatePhotoAsync(IFormFile file);
    Task<DeletionResult> DeletePhotoAsync(string publicId);
  }
}
