using CloudinaryDotNet.Actions;

namespace SoDauBai.Application.Interfaces.Services
{
  public interface IPhotoService
  {
    Task<ImageUploadResult> CreatePhotoAsync(IFormFile file);
    Task<DeletionResult> DeletePhotoAsync(string publicId);
  }
}


