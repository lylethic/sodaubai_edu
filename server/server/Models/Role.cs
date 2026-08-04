namespace server.Models;

public partial class Role : IBaseEntity
{
  public int Id { get; set; }

  public string NameRole { get; set; } = null!;

  public string Description { get; set; } = null!;

  public DateTime? DateCreated { get; set; }

  public DateTime? DateUpdated { get; set; }

  public virtual ICollection<Account> Accounts { get; set; } = new List<Account>();
}
