# ==============================================================================
# Multi-stage Dockerfile cho SoDauBai.Api (.NET 8 Production)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build & Publish
# ------------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sao chép file solution và các file project để tận dụng Docker layer caching khi restore
COPY server.sln ./
COPY src/SoDauBai.Domain/SoDauBai.Domain.csproj src/SoDauBai.Domain/
COPY src/SoDauBai.Application/SoDauBai.Application.csproj src/SoDauBai.Application/
COPY src/SoDauBai.Infrastructure/SoDauBai.Infrastructure.csproj src/SoDauBai.Infrastructure/
COPY src/SoDauBai.Api/SoDauBai.Api.csproj src/SoDauBai.Api/

# Khôi phục dependencies (chỉ tải lại nếu có thay đổi trong các file .csproj)
RUN dotnet restore src/SoDauBai.Api/SoDauBai.Api.csproj

# Sao chép toàn bộ mã nguồn của các dự án
COPY src/ src/

# Build và publish ứng dụng ra thư mục /app/publish
WORKDIR /src/src/SoDauBai.Api
RUN dotnet publish SoDauBai.Api.csproj -c Release -o /app/publish /p:UseAppHost=false --no-restore

# ------------------------------------------------------------------------------
# Stage 2: Runtime Production
# ------------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Thiết lập các biến môi trường chuẩn cho Production trong container
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true

# Tạo thư mục Uploads để chứa file/ảnh và gán quyền
RUN mkdir -p /app/Uploads

# Sao chép kết quả build từ stage build
COPY --from=build /app/publish .

# Mở cổng 8080 của ứng dụng
EXPOSE 8080

# Chạy ứng dụng API
ENTRYPOINT ["dotnet", "SoDauBai.Api.dll"]
