using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using SoDauBai.Application.Interfaces.Repositories;
using SoDauBai.Application.Interfaces.Services;

namespace SoDauBai.Infrastructure.Services
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

      // Sanitize folder name / subdirectory path to ensure safety and prevent Path Traversal (..)
      var cleanFolderName = SanitizeFolderName(folderName);

      // Validate file extension if specified
      var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
      if (allowedExtensions != null && allowedExtensions.Length > 0)
      {
        var formattedAllowed = allowedExtensions.Select(e => e.StartsWith(".") ? e.ToLowerInvariant() : $".{e.ToLowerInvariant()}");
        if (!formattedAllowed.Contains(extension))
        {
          throw new InvalidOperationException($"Định dạng file {extension} không được hỗ trợ.");
        }
      }

      // Physical directory path: [ContentRootPath]/Uploads/[cleanFolderName]
      var uploadDirectory = Path.Combine(_environment.ContentRootPath, RootUploadFolder, cleanFolderName.Replace('/', Path.DirectorySeparatorChar));
      
      // If directory does not exist, automatically create it (including nested parent/child directories)
      if (!Directory.Exists(uploadDirectory))
      {
        Directory.CreateDirectory(uploadDirectory);
      }

      // Generate a unique file name using GUID combined with safe original name
      var safeOriginalName = Path.GetFileNameWithoutExtension(file.FileName);
      var uniqueFileName = $"{Guid.NewGuid()}_{safeOriginalName}{extension}";
      var physicalPath = Path.Combine(uploadDirectory, uniqueFileName);

      using (var stream = new FileStream(physicalPath, FileMode.Create))
      {
        await file.CopyToAsync(stream);
      }

      // Return relative path delimited by "/"
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

      // Split folder segments (supports nested paths like "teachers/avatars")
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

