<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/Ti%E1%BA%BFng_Vi%E1%BB%87t-%F0%9F%87%BB%F0%9F%87%B3-d73a49?style=for-the-badge" alt="Tiếng Việt" /></a>
  <a href="./README_en.md"><img src="https://img.shields.io/badge/English-%F0%9F%87%AC%F0%9F%87%A7-0969da?style=for-the-badge" alt="English" /></a>
</p>

# 📘 SỔ ĐẦU BÀI - Electronic Class Logbook Management

> This website overcomes the drawbacks of paper class logbooks, such as logbooks getting lost or wet, or the class monitor forgetting to fetch the logbook. In particular, it lets teachers write entries and edit them immediately (within a set time window) from any Internet-connected electronic device.

## 🧠 Purpose

- Help schools manage class logbooks through a website.
- Allow the principal to monitor teaching status and quickly review the lessons of all classes.
- Let teachers use electronic devices such as phones, tablets, and laptops to create and edit lesson information without having to go to the classroom.
- Record lesson topics and evaluate progress by day and week, helping teachers and the school understand teaching effectiveness.

## 🖥️ User Interface

The frontend is built with **Next.js** and the modern **Shadcn UI** component library, delivering a smooth, fast experience that is optimized across many devices.

## 🔧 Technologies Used

### Front-end

- **Next.js 14+** (React, App Router, TypeScript)
- **Shadcn UI** & **Tailwind CSS**

### Back-end

- **.NET 8.0 (C# 12)** / **ASP.NET Core Web API**
- **Entity Framework Core 8.0** & **Dapper**
- **Microsoft SQL Server** (supports a failover connection string mechanism)
- **ASP.NET Core API Versioning** (`Asp.Versioning.Mvc` - standard `api/v1/[controller]`)
- **JWT Authentication** & **Role-Based Access Control (RBAC)** with permission filters
- **AutoMapper 13.x**
- **CloudinaryDotNet** (image management and storage)
- **ClosedXML & ExcelDataReader** (Excel file import/export processing)
- **log4net & Microsoft.Extensions.Logging**

---

## 🏛️ Software Architecture

The backend system is designed and refactored according to a **Layered (N-Tier) Architecture** consisting of 4 independently separated layers, applying the Dependency Inversion principle with a strict one-way dependency flow:

```text
server/
├── server.sln                                          # Solution linking all projects
└── src/
    ├── SoDauBai.Domain/                                # 1. Domain Layer (pure Entity Models, 0 external dependencies)
    │   ├── Common/ (IBaseEntity.cs)                    # Common entity standard (Id, Deleted, DateCreated, DateUpdated)
    │   └── Entities/ (27 Domain Entities)              # Student, Week, Class, Teacher, ChiTietSoDauBai,...
    │
    ├── SoDauBai.Application/                           # 2. Application Layer (Business logic, DTOs & Contracts)
    │   ├── Common/ (Exceptions, ApiResponseModel, PaginatedResponse)
    │   ├── DTOs/ (DTO objects, Types/ response wrappers)
    │   ├── DTOs/Search/ (16 Search DTOs inheriting QueryObject)
    │   ├── Interfaces/ (Contracts for Repositories and Services)
    │   └── Mappings/ (AppAutomapper Profile)
    │
    ├── SoDauBai.Infrastructure/                        # 3. Infrastructure Layer (Data access & Integrations)
    │   ├── Data/ (SoDauBaiContext - EF Core DbContext)
    │   ├── Repositories/ (BaseRepository<TEntity> & specific Repositories)
    │   ├── Services/ (SessionUser, FileUploadService, LoggerManager, TokenService,...)
    │   ├── Helpers/ (ExcelHelper, ValidatorHelper)
    │   └── DependencyInjection.cs                      # AddInfrastructureServices(Configuration)
    │
    └── SoDauBai.Api/                                   # 4. Presentation Layer (ASP.NET Core Web API Host)
        ├── Controllers/ (BaseApiController.cs)         # Base controller standardizing Success/Error envelope
        ├── Controllers/v1/                             # All 26 versioned API Controllers
        ├── Filters/ (AuthorizationFilter, CustomAuthorize, RequirePermission)
        ├── Middlewares/ (ApiLoggingMiddleware, JWTHeaderMiddleware)
        ├── Transformers/ (SlugifyParameterTransformer)
        ├── Program.cs                                  # Streamlined Composition Root
        └── appsettings.json / log4net.config
```

### Core Design Patterns & Architectural Improvements:

1. **Generic Repository Pattern (`BaseRepository<TEntity>`):**
   - Standardizes all CRUD operations, offset/cursor pagination, bulk delete, and an automatic soft-delete mechanism (`Deleted = true`).
2. **Base API Controller & Standard Response Envelope (`ApiResponseModel`):**
   - Every endpoint returns a uniform format through `Success(data)` / `Error(ex)`.
3. **Advanced Authorization & Security:**
   - The `[CustomAuthorize]` filter combined with `[RequirePermission("CREATE")]`, `[RequirePermission("UPDATE")]`, and `[RequirePermission("DELETE")]`.
4. **Dependency Injection Encapsulation:**
   - All configuration for DbContext, failover, repositories, and adapters is packaged into the extension method `services.AddInfrastructureServices(Configuration)`.

---

## 🚀 Key Features

- 📆 Record and edit lessons by week/day.
- 👨‍🏫 Teachers can easily work on their phones.
- 🏫 The principal and the school can monitor school-wide teaching progress.
- 🔒 Security and user authorization by role: teacher, administrator, principal.
- 📊 Overview statistics of lessons by week/class.
- 📥 Export and import logbook data and teaching assignments via Excel.

## 📸 Interface Demo

_Back-end_
![Project](./client-next/public/images/diagram_Sodaubai.png)

_Back-end API Testing_
![Project](./client-next/public/images/server1.png)
![Project](./client-next/public/images/server2.png)

_Front-end_
_Login screen_
![Project](./client-next/public/images/login_sdb.png)

_ADMIN layout..._

> Logbook details
> ![Project](./client-next/public/images/sodaubai_chitiet.png) > ![Project](./client-next/public/images/sodaubai_chitiet2.png)

_Teacher layout..._

> Logbook details
> ![Project](./client-next/public/images/sodaubai_teacher1.png) > ![Project](./client-next/public/images/sodaubai_teacher2_chitiet.png)

> Weekly study score statistics by week
> ![Project](./client-next/public/images/thongke1.png)

---

## 📂 Installation & Deployment

### 1. Back-end (.NET 8)

```bash
# Navigate to the project directory
cd server

# Restore dependencies and build the entire solution (4 projects)
dotnet restore server.sln
dotnet build server.sln

# Run the Web API host
dotnet run --project src/SoDauBai.Api/SoDauBai.Api.csproj

# Or run in watch mode (hot reload)
dotnet watch --project src/SoDauBai.Api/SoDauBai.Api.csproj
```

- **Swagger UI:** `http://localhost:5000/swagger`
- **OpenAPI Schema:** `http://localhost:5000/swagger/v1/swagger.json`

### 2. Front-end (Next.js)

```bash
# Navigate to the client directory
cd client-next

# Install dependencies
npm install # or yarn install

# Start the development environment
npm run dev # or yarn dev
```

- **Client URL:** `http://localhost:3000`

### 3. Testing with Cypress

```bash
cd client-next
yarn run cypress:open
```

---

## 💡 Contributing

We always welcome feedback and pull requests from the community to help make the project better!
