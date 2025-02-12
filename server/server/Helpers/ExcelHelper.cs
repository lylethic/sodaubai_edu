namespace server.Helpers
{
  public static class ExcelHelper
  {
    // Helper method to convert Excel date (double) to DateOnly
    public static DateOnly? ConvertExcelDateToDateOnly(object value)
    {
      if (value is double excelDate)
      {
        // Convert Excel serial date to DateTime
        var dateTime = DateTime.FromOADate(excelDate);
        return DateOnly.FromDateTime(dateTime);
      }
      else if (value is DateTime dateTime)
      {
        // If it's already a DateTime, just convert it to DateOnly
        return DateOnly.FromDateTime(dateTime);
      }

      return null; // If the value cannot be converted
    }
  }
}
