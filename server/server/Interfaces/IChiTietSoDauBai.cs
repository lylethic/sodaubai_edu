using server.Dtos;
using server.Types.ChiTietSoDauBai;

namespace server.IService
{
  public interface IChiTietSoDauBai
  {
    Task<ChiTietSoDauBaiResType> CreateChiTietSoDauBai(ChiTietSoDauBaiDto model);

    Task<ChiTietSoDauBaiResType> GetChiTietSoDauBai(int id);

    Task<ChiTietSoDauBaiResType> GetChiTietSoDauBais(QueryObject? query);

    Task<ChiTietSoDauBaiResType> GetChiTietSoDauBaisByWeek(QueryObject? query, int weekId);

    Task<ChiTietSoDauBaiResType> DeleteChiTietSoDauBai(int id);

    Task<ChiTietSoDauBaiResType> UpdateChiTietSoDauBai(int id, ChiTietSoDauBaiDto model);

    Task<ChiTietSoDauBaiResType> ImportExcel(IFormFile file);

    Task<ChiTietSoDauBaiResType> BulkDelete(List<int> ids);

    /// <summary>
    /// ###Retrieves: 
    /* SELECT ct.chiTietSoDauBaiId, b.biaSoDauBaiId, b.classId, b.schoolId, c.className, t.teacherId, t.fullname
        FROM dbo.ChiTietSoDauBai as ct
        LEFT JOIN dbo.BiaSoDauBai as b ON ct.biaSoDauBaiId = b.biaSoDauBaiId 
        LEFT JOIN dbo.Class as c ON b.classId = c.classId 
        LEFT JOIN dbo.Teacher as t ON c.teacherId = t.teacherId
        WHERE ct.chiTietSoDauBaiId = @id
    */
    /// </summary>
    /// <returns></returns>
    Task<ChiTietSoDauBaiResType> GetChiTiet_Bia_Class_Teacher(int chiTietId);

    /// <summary>Get chitietid show info Week</summary>
    /// <param name="chiTietId"></param>
    /// <returns>
    /// {
    ///  "statusCode": 200,
    /// "message": "",
    ///  "data": {
    ///   "chiTietSoDauBaiId": 2,
    ///    "weekId": 1,
    ///    "weekName": "Tuần 1",
    ///    "status": true,
    ///    "xepLoaiId": 1,
    ///    "tenXepLoai": "A",
    ///    "soDiem": 10
    ///  }
    ///}
    /// </returns>
    Task<ChiTietSoDauBaiResType> GetChiTiet_Week_XepLoai(int chiTietId);

    /// <summary>
    /// Get chi tiet sdb by SchoolId and weekId and BiaSoDauBaiId and ClassId
    /// </summary>
    /// <param name="schoolId"></param>
    /// <param name="weekId"></param>
    /// <returns>chiTiet.*, 
    ///  c.className, 
    ///  t.teacherId, 
    ///  t.fullname
    ///  </returns>
    Task<ChiTietSoDauBaiResType> GetChiTietBySchool(ChiTietSoDauBaiQuery queryChiTiet);

    Task<ChiTietSoDauBaiResType> GetAllChiTietsByBia(ChiTietSoDauBaiByBiaQuery queryChiTiet);
    Task<ChiTietSoDauBaiResType> ExportChiTietSoDauBaiToExcel(int weekId, int classId, string filePath);
  }
}
