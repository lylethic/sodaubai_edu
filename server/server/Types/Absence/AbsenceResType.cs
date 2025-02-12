using server.Models;

namespace server.Types.Absence
{
  public class AbsenceResType
  {
    public int AbsenceId { get; set; }

    public int? CallRollId { get; set; }

    public int StudentId { get; set; }

    public string? Description { get; set; }

    public Student? Students { get; set; }
  }
}
