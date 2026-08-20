using Microsoft.AspNetCore.Http;

namespace server.Interfaces
{
  public interface IFileUploadService
  {
    /// <summary>
    /// Upload một file vào thư mục con bên trong thư mục Uploads.
    /// </summary>
    /// <param name="file">File upload từ request</param>
    /// <param name="folderName">Tên thư mục con bên trong Uploads (ví dụ: "avatars", "documents", "excels")</param>
    /// <param name="allowedExtensions">Mảng đuôi file cho phép (ví dụ: [".jpg", ".png", ".pdf"]). Để null nếu cho phép tất cả</param>
    /// <returns>Đường dẫn tương đối của file đã lưu (ví dụ: "Uploads/avatars/guid_filename.ext")</returns>
    Task<string> UploadFileAsync(IFormFile file, string folderName, string[]? allowedExtensions = null);

    /// <summary>
    /// Upload danh sách file vào thư mục con bên trong thư mục Uploads.
    /// </summary>
    /// <param name="files">Danh sách file</param>
    /// <param name="folderName">Tên thư mục con bên trong Uploads</param>
    /// <param name="allowedExtensions">Mảng đuôi file cho phép</param>
    /// <returns>Danh sách đường dẫn tương đối của các file đã lưu</returns>
    Task<List<string>> UploadFilesAsync(IEnumerable<IFormFile> files, string folderName, string[]? allowedExtensions = null);

    /// <summary>
    /// Xóa file vật lý dựa trên đường dẫn tương đối.
    /// </summary>
    /// <param name="relativeFilePath">Đường dẫn tương đối (ví dụ: "Uploads/avatars/abc.jpg")</param>
    /// <returns>True nếu xóa thành công, False nếu không tìm thấy hoặc lỗi</returns>
    bool DeleteFile(string relativeFilePath);

    /// <summary>
    /// Lấy đường dẫn vật lý đầy đủ từ đường dẫn tương đối.
    /// </summary>
    string GetPhysicalFilePath(string relativeFilePath);

    /// <summary>
    /// Kiểm tra file có tồn tại hay không.
    /// </summary>
    bool FileExists(string relativeFilePath);
  }
}
