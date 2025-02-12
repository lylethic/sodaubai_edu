using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using server.Dtos;
using server.IService;

namespace server.Repositories
{
  public class PhotoRepositories : IPhotoService
  {
    private readonly Cloudinary _cloudinary;
    private readonly IConfiguration _config;

    public PhotoRepositories(
        IConfiguration config,
        IOptions<CloudinarySetting> cloudinary,
        IWebHostEnvironment environment
      )
    {
      _config = config;

      var account = new Account()
      {
        Cloud = config["CloudinarySettings:CloudName"],
        ApiKey = config["CloudinarySettings:APIKey"],
        ApiSecret = config["CloudinarySettings:APISecret"],
      };
      _cloudinary = new Cloudinary(account);
      _cloudinary.Api.Secure = true;
    }
    public async Task<ImageUploadResult> CreatePhotoAsync(IFormFile file)
    {
      var uploadResult = new ImageUploadResult();
      if (file.Length > 0)
      {
        using var stream = file.OpenReadStream();

        var uploadParams = new ImageUploadParams
        {
          File = new FileDescription(file.FileName, stream),
          QualityAnalysis = true,

          // Thay doi kich thuoc anh nhung ma no mow anh lam.
          Transformation = new Transformation().Crop("limit").Width(400).Height(400),

          PublicId = file.FileName,

          // Add vao Folder minh tao tren cloudinary.
          Folder = _config["CloudinarySettings:Folder_Name"]

        };
        uploadResult = await _cloudinary.UploadAsync(uploadParams);
        if (uploadResult.Error != null)
        {
          throw new Exception("Image upload failed.");
        }
      }
      return uploadResult;
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
      var deleteParams = new DeletionParams(publicId);
      var result = await _cloudinary.DestroyAsync(deleteParams);

      return result;
    }
  }
}
