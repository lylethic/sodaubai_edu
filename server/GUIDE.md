To run the backend server with the new Layered (N-Tier) architecture, follow these steps:
──────

### 1. From the Repository Root (E:\server\sodaubai_edu)

#### Standard Run:

```powershell
dotnet run --project server/src/SoDauBai.Api/SoDauBai.Api.csproj
```

#### Run with Hot-Reload (Auto-restarts on code changes):

```powershell
dotnet watch --project server/src/SoDauBai.Api/SoDauBai.Api.csproj
```

──────

### 2. Or Navigate into the server Directory

```powershell
cd server
```

# Build solution (optional, dotnet run builds automatically)

```powershell
dotnet build server.sln
```

# Start the Web API

```powershell
dotnet run --project src/SoDauBai.Api/SoDauBai.Api.csproj
```

──────

### 3. Accessing the Running Server

Once started, the server listens by default at:

- Base URL: http://localhost:5000
- Swagger Documentation & Testing: http://localhost:5000/swagger http://localhost:5000/swagger
- OpenAPI v1 JSON: http://localhost:5000/swagger/v1/swagger.json

# Tip

- Ensure your database connection strings (SoDauBaiContext / SoDauBaiContextFailover) in appsettings.json are properly configured before running.
