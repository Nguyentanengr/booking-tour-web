# Sử dụng Node.js phiên bản LTS
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để serve static files
FROM nginx:alpine

# Copy file build từ bước trước vào Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx (tuỳ chọn, nếu cần)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]