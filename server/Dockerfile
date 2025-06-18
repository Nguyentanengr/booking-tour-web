# Sử dụng Node.js phiên bản LTS
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Mở cổng mà backend chạy (giả sử 5000)
EXPOSE 5000

# Chạy ứng dụng
CMD ["npm", "start"]