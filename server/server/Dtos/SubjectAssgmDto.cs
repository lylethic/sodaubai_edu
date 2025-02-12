namespace server.Dtos
{
  // Phan cong giang day mon hoc
  public class SubjectAssgmDto
  {
    public int SubjectAssignmentId { get; set; }

    public int TeacherId { get; set; }

    public int SubjectId { get; set; }

    public string? Description { get; set; }

    public DateTime? DateCreated { get; set; }

    public DateTime? DateUpdated { get; set; }
  }

  public class SubjectAssgmDetail : SubjectAssgmDto
  {
    public string? SubjectName { get; set; }
    public string? Fullname { get; set; }
  }
}
