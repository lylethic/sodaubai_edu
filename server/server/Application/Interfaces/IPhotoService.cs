using CloudinaryDotNet.Actions;

namespace server.Application.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> CreatePhotoAsync(IFormFile file);
        Task<DeletionResult> DeletePhotoAsync(string publicId);
    }
}
