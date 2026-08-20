using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using server.Interfaces;

namespace server.Services
{
  public class FileUploadService : IFileUploadService
  {
    private readonly IWebHostEnvironment _environment;
    private const string RootUploadFolder = "Uploads";

    public FileUploadService(IWebHostEnvironment environment)
    {
      _environment = environment;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string folderName, string[]? allowedExtensions = null)
    {
      if (file == null || file.Length == 0)
      {
        throw new ArgumentException("File tải lên không hợp lệ hoặc rỗng.", nameof(file));
      }

      // Chuẩn hóa tên thư mục/đường dẫn thư mục con để an toàn và chống Path Traversal (..)
      var cleanFolderName = SanitizeFolderName(folderName);

      // Kiểm tra định dạng file mở rộng nếu có chỉ định
      var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
      if (allowedExtensions != null && allowedExtensions.Length > 0)
      {
        var formattedAllowed = allowedExtensions.Select(e => e.StartsWith(".") ? e.ToLowerInvariant() : $".{e.ToLowerInvariant()}");
        if (!formattedAllowed.Contains(extension))
        {
          throw new InvalidOperationException($"Định dạng file {extension} không được hỗ trợ.");
        }
      }

      // Đường dẫn thư mục vật lý: [ContentRootPath]/Uploads/[cleanFolderName]
      var uploadDirectory = Path.Combine(_environment.ContentRootPath, RootUploadFolder, cleanFolderName.Replace('/', Path.DirectorySeparatorChar));
      
      // Nếu thư mục chưa tồn tại, tự động tạo mới thư mục đó (kể cả các thư mục cha/con lồng nhau)
      if (!Directory.Exists(uploadDirectory))
      {
        Directory.CreateDirectory(uploadDirectory);
      }

      // Đặt tên file ngẫu nhiên với GUID kết hợp tên gốc an toàn
      var safeOriginalName = Path.GetFileNameWithoutExtension(file.FileName);
      var uniqueFileName = $"{Guid.NewGuid()}_{safeOriginalName}{extension}";
      var physicalPath = Path.Combine(uploadDirectory, uniqueFileName);

      using (var stream = new FileStream(physicalPath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      // Trả về đường dẫn tương đối phân cách bằng dấu "/"
      return $"{RootUploadFolder}/{cleanFolderName}/{uniqueFileName}";
    }

    public async Task<List<string>> UploadFilesAsync(IEnumerable<IFormFile> files, string folderName, string[]? allowedExtensions = null)
    {
      var uploadedPaths = new List<string>();
      if (files == null)
      {
        return uploadedPaths;
      }

      foreach (var file in files)
      {
        if (file != null && file.Length > 0)
        {
          var path = await UploadFileAsync(file, folderName, allowedExtensions);
          uploadedPaths.Add(path);
        }
      }

      return uploadedPaths;
    }

    public bool DeleteFile(string relativeFilePath)
    {
      if (string.IsNullOrWhiteSpace(relativeFilePath))
      {
        return false;
      }

      var physicalPath = GetPhysicalFilePath(relativeFilePath);
      if (File.Exists(physicalPath))
      {
        File.Delete(physicalPath);
        return true;
      }

      return false;
    }

    public string GetPhysicalFilePath(string relativeFilePath)
    {
      if (string.IsNullOrWhiteSpace(relativeFilePath))
      {
        return string.Empty;
      }

      var normalizedPath = relativeFilePath.TrimStart('/', '\\')
        .Replace('/', Path.DirectorySeparatorChar)
        .Replace('\\', Path.DirectorySeparatorChar);

      return Path.Combine(_environment.ContentRootPath, normalizedPath);
    }

    public bool FileExists(string relativeFilePath)
    {
      var physicalPath = GetPhysicalFilePath(relativeFilePath);
      return !string.IsNullOrEmpty(physicalPath) && File.Exists(physicalPath);
    }

    private static string SanitizeFolderName(string folderName)
    {
      if (string.IsNullOrWhiteSpace(folderName))
      {
        return "Default";
      }

      // Tách các phân đoạn thư mục (hỗ trợ cả đường dẫn lồng nhau như "teachers/avatars")
      var separators = new[] { '/', '\\' };
      var invalidChars = Path.GetInvalidFileNameChars();

      var segments = folderName.Split(separators, StringSplitOptions.RemoveEmptyEntries)
        .Where(segment => segment != "." && segment != ".." && !string.IsNullOrWhiteSpace(segment))
        .Select(segment => string.Concat(segment.Where(c => !invalidChars.Contains(c))))
        .Where(segment => !string.IsNullOrWhiteSpace(segment));

      var cleanPath = string.Join("/", segments);
      return string.IsNullOrWhiteSpace(cleanPath) ? "Default" : cleanPath;
    }
  }
}
