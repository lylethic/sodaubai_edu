namespace SoDauBai.Application.DTOs
{
  public class PC_GiangDay_BiaSDBDto
  {
    public int Id { get => PhanCongGiangDayId; set => PhanCongGiangDayId = value; }
    public int PhanCongGiangDayId { get; set; }

    public int TeacherId { get; set; }

    public int BiaSoDauBaiId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}


