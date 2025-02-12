namespace server.Dtos
{
  public class PC_GiangDay_BiaSDBDto
  {
    public int PhanCongGiangDayId { get; set; }

    public int TeacherId { get; set; }

    public int BiaSoDauBaiId { get; set; }

    public bool Status { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }
}
