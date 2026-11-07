# Hướng dẫn triển khai Docker cho Backend SoDauBai.Api (.NET 8)

Thư mục này chứa toàn bộ cấu hình Docker và Docker Compose phục vụ cho việc đóng gói và triển khai backend `server/src/SoDauBai.Api` lên môi trường Production.

---

## 1. Cấu trúc thư mục
```
docker/
├── Dockerfile          # Multi-stage build (.NET 8 SDK -> ASP.NET Runtime)
├── .dockerignore       # Loại trừ các file rác, bin/obj, logs khỏi build context
├── docker-compose.yml  # Định nghĩa dịch vụ API + SQL Server 2022
├── .env.example        # Mẫu file cấu hình biến môi trường
└── README.md           # Hướng dẫn chi tiết này
```

---

## 2. Các bước triển khai trên Production Server

### Bước 1: Sao chép mã nguồn lên server
Đảm bảo bạn đã đưa toàn bộ project lên server (hoặc clone qua Git).

### Bước 2: Thiết lập biến môi trường
Truy cập thư mục `docker` và tạo file `.env` từ file mẫu:
```bash
cd docker
cp .env.example .env
```
Mở file `.env` và cập nhật các thông số bảo mật:
- `DB_PASSWORD`: Mật khẩu tài khoản `sa` của SQL Server (yêu cầu mật khẩu mạnh).
- `CONNECTION_STRING`: Chuỗi kết nối đến database.
- `JWT_SECRET_KEY`: Khóa bí mật cho JWT token.
- `API_PORT`: Cổng bạn muốn expose trên server (mặc định: `5000`).

### Bước 3: Khởi chạy bằng Docker Compose
Tại thư mục `docker`, chạy lệnh:
```bash
docker compose up -d --build
```
Lệnh này sẽ:
1. Tự động build image cho `SoDauBai.Api` theo chuẩn Multi-stage build.
2. Tải và khởi động container `sodaubai_db` (SQL Server 2022).
3. Đợi container database khởi động hoàn tất (healthy check) rồi mới khởi động container `sodaubai_api`.
4. Ánh xạ dữ liệu upload vào volume `sodaubai_uploads_data` và dữ liệu database vào `sodaubai_mssql_data`.

---

## 3. Các lệnh quản lý thường dùng

### Xem trạng thái container:
```bash
docker compose ps
```

### Xem log trực tiếp của API:
```bash
docker compose logs -f api
```

### Xem log của Database:
```bash
docker compose logs -f db
```

### Dừng dịch vụ:
```bash
docker compose down
```

### Cập nhật phiên bản mới:
Khi có code mới, chỉ cần kéo code về và chạy lại:
```bash
docker compose up -d --build
```

---

## 4. Khởi tạo Database ban đầu (Nếu chưa có dữ liệu)
Nếu đây là lần đầu triển khai, bạn có thể chạy script `sample_sql_schema.sql` (ở thư mục `server/sample_sql_schema.sql`) vào container SQL Server:
```bash
docker exec -i sodaubai_db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<DB_PASSWORD_CUA_BAN>" -C < ../server/sample_sql_schema.sql
```

---

## 5. Lưu ý bảo mật Production
1. **Tuyệt đối không commit file `.env`** vào kho mã nguồn Git.
2. **Reverse Proxy & HTTPS**: Khuyến nghị dùng Nginx hoặc Caddy làm reverse proxy phía trước để cấu hình chứng chỉ SSL/HTTPS (Let's Encrypt) chuyển tiếp request tới `http://localhost:5000`.
