using System.Text.RegularExpressions;

namespace SoDauBai.Infrastructure.Helpers
{
  public static class ValidatorHepler
  {
    public static bool IsValidEmail(string email)
    {
      var regex = @"^[\w\.-]+@gmail\.com$";
      return Regex.IsMatch(email, regex);
    }
  }
}

