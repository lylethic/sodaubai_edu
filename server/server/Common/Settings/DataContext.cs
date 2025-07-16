using System.Data;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;
using server.Common.Models;

namespace server.Common.Settings;

public class DataContext
{
    private readonly DbSettings _dbSettings;

    public DataContext(IOptions<DbSettings> dbSettings)
    {
        _dbSettings = dbSettings.Value;
    }

    public IDbConnection CreateConnection()
    {
        var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING_SQLSERVER");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException("Missing CONNECTION_STRING_SQLSERVER in environment.");
        }

        return new SqlConnection(connectionString);
    }

    public async Task Init()
    {
        await _initTables();
    }

    private async Task _initTables()
    {
        using var connection = CreateConnection();
        await _initAccounts();

        async Task _initAccounts()
        {
            var sql = """
                IF OBJECT_ID('Account', 'U') IS NULL
                CREATE TABLE Account (
                    accountId INT NOT NULL PRIMARY KEY IDENTITY,
                    roleId INT,
                    schoolId NVARCHAR(MAX),
                    email NVARCHAR(MAX),
                    password NVARCHAR(MAX),
                    passwordSalt NVARCHAR(MAX),
                    dateCreated NVARCHAR(MAX),
                    dateUpdated NVARCHAR(MAX)
                );
            """;
            await connection.ExecuteAsync(sql);
        }
    }
}
