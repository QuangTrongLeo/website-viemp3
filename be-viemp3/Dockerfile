# Stage 1: Build ứng dụng
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Ép hệ thống Linux trong container sử dụng bảng mã UTF-8 để đọc ký tự có dấu
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Biên dịch mã nguồn
COPY src ./src
# Thêm cờ ép mã hóa UTF-8 khi biên dịch tài nguyên (Resource Filtering)
RUN mvn clean package -DskipTests -Dfile.encoding=UTF-8

# Stage 2: Khởi chạy ứng dụng
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Đảm bảo môi trường chạy ứng dụng cũng hỗ trợ UTF-8
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Tạo thư mục lưu file upload tạm nếu cần
RUN mkdir -p /app/uploads

# Sao chép file jar đã build từ Stage 1
COPY --from=build /app/target/*.jar app.jar

# Mở cổng chạy nội bộ
EXPOSE 8080

# Chạy ứng dụng kèm cấu hình UTF-8 cho máy ảo Java (JVM)
ENTRYPOINT ["java", "-Dfile.encoding=UTF-8", "-jar", "app.jar"]