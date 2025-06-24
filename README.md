# Poll App - Docker Deployment Guide

Ứng dụng Poll API được viết bằng Node.js, Express và MongoDB.

## 🚀 Hướng dẫn Docker Deployment

### 1. Build Docker Image

```bash
# Build image locally
docker build -t poll-app:latest .

# Hoặc sử dụng script
chmod +x scripts/build.sh
./scripts/build.sh
```

### 2. Chạy ứng dụng với Docker Compose (Development)

```bash
# Chạy với MongoDB
docker-compose up -d

# Xem logs
docker-compose logs -f app

# Dừng services
docker-compose down
```

### 3. Chạy ứng dụng với Docker (Production)

```bash
# Chạy container
docker run -d \
  --name poll-app \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  poll-app:latest

# Xem logs
docker logs -f poll-app

# Dừng container
docker stop poll-app
```

### 4. Deploy lên Docker Hub

#### Bước 1: Đăng nhập Docker Hub

```bash
docker login
```

#### Bước 2: Tag image

```bash
# Thay YOUR_USERNAME bằng username Docker Hub của bạn
docker tag poll-app:latest YOUR_USERNAME/poll-app:latest
docker tag poll-app:latest YOUR_USERNAME/poll-app:1.0.0
```

#### Bước 3: Push lên Docker Hub

```bash
docker push YOUR_USERNAME/poll-app:latest
docker push YOUR_USERNAME/poll-app:1.0.0
```

#### Hoặc sử dụng script

```bash
# Chỉnh sửa DOCKER_USERNAME trong scripts/deploy.sh
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 5. Deploy lên EC2

#### Bước 1: Kết nối EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Bước 2: Cài đặt Docker trên EC2

```bash
# Update system
sudo apt update

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### Bước 3: Pull và chạy image từ Docker Hub

```bash
# Pull image
docker pull YOUR_USERNAME/poll-app:latest

# Chạy container
docker run -d \
  --name poll-app \
  -p 80:3000 \
  -e MONGODB_URI=mongodb://your-mongodb-uri \
  -e JWT_SECRET=your-jwt-secret \
  --restart unless-stopped \
  YOUR_USERNAME/poll-app:latest
```

### 6. Pull về Docker Desktop

Sau khi deploy lên EC2, bạn có thể pull image về Docker Desktop:

```bash
# Pull image về local
docker pull YOUR_USERNAME/poll-app:latest

# Chạy trên Docker Desktop
docker run -d \
  --name poll-app-local \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://localhost:27017/poll-app \
  YOUR_USERNAME/poll-app:latest
```

## 🔧 Environment Variables

Tạo file `.env` với các biến sau:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/poll-app
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

## 📋 API Endpoints

- `GET /` - Health check
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/polls` - Lấy danh sách polls
- `POST /api/v1/polls` - Tạo poll mới
- `POST /api/v1/votes` - Bỏ phiếu

## 🐳 Docker Commands Hữu ích

```bash
# Xem images
docker images

# Xem containers đang chạy
docker ps

# Xem tất cả containers
docker ps -a

# Xem logs
docker logs container_name

# Vào container
docker exec -it container_name sh

# Xóa container
docker rm container_name

# Xóa image
docker rmi image_name
```

## 🔍 Troubleshooting

### Lỗi kết nối MongoDB

- Kiểm tra MONGODB_URI trong environment variables
- Đảm bảo MongoDB đang chạy và accessible

### Lỗi port đã được sử dụng

- Thay đổi port mapping: `-p 3001:3000`
- Kiểm tra port đang được sử dụng: `netstat -tulpn | grep :3000`

### Lỗi permission

- Chạy với sudo (Linux/Mac)
- Đảm bảo user có quyền truy cập Docker
