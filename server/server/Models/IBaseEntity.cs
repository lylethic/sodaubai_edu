namespace server.Models;

public interface IBaseEntity
{
  int Id { get; set; }
  bool? Deleted { get; set; }
  DateTime? DateCreated { get; set; }
  DateTime? DateUpdated { get; set; }
}
