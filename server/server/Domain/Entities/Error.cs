namespace server.Domain.Entities;

public class Error
{
  public string? Field { get; set; }
  public string? Message { get; set; }

  public Error()
  {
    Console.WriteLine("Error class instance!");
  }

  public Error(string field, string message)
  {
    Field = field;
    Message = message;
  }
}
