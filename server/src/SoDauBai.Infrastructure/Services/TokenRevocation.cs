using System.Security.Cryptography;
using System.Text;

namespace SoDauBai.Infrastructure.Services;

public static class TokenRevocation
{
    public static string GetStorageValue(string token)
    {
        var hash = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return $"revoked:{Convert.ToHexString(hash)}";
    }
}
