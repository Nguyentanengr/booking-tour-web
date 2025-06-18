# API Specification for Payment Management

## 1. API Lấy Danh Sách Thanh Toán

**Mô tả**: Trả về danh sách các giao dịch thanh toán/hoàn tiền, hỗ trợ lọc theo từ khóa tìm kiếm, loại giao dịch, trạng thái, phương thức thanh toán, và phân trang.

- **URL**: `/api/payments`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **Query Parameters**:
  - `search` (string, optional): Từ khóa tìm kiếm theo `transaction_id`, `_id`, hoặc `user.name` trong `bookings`.
  - `type` (string, optional): Loại giao dịch (`payment`, `refund`, hoặc `all`).
  - `status` (string, optional): Trạng thái giao dịch (`success`, `pending`, `failed`, `cancelled`, hoặc `all`).
  - `method` (string, optional): Phương thức thanh toán (`bank_transfer`, `credit_card`, `e_wallet`, `cash`, hoặc `all`).
  - `page` (number, optional, default: 1): Số trang hiện tại.
  - `limit` (number, optional, default: 10): Số lượng giao dịch mỗi trang.
- **Request Example**:
  ```
  GET /api/payments?search=txn_123&type=payment&status=success&method=bank_transfer&page=1&limit=10
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": {
        "payments": [
          {
            "_id": "507f1f77bcf86cd799439023",
            "booking_id": "507f1f77bcf86cd799439020",
            "cancellation_id": null,
            "type": "payment",
            "amount": 8390000,
            "payment_method": "bank_transfer",
            "transaction_id": "txn_123456",
            "status": "success",
            "created_at": "2025-05-21T23:00:00Z",
            "user_name": "Nguyen Van A"
          },
          ...
        ],
        "pagination": {
          "currentPage": 1,
          "totalPages": 5,
          "totalItems": 50,
          "limit": 10
        }
      },
      "error": null,
      "timestamp": "2025-06-17T16:19:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **400 Bad Request** (nếu tham số không hợp lệ):
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Tham số không hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép truy cập.
  - Dữ liệu `user_name` được lấy bằng cách join với collection `bookings` dựa trên `booking_id`.
  - Bộ lọc `search` tìm kiếm trong `transaction_id`, `_id` của `payments`, và `user.name` từ `bookings`.
  - Chỉ trả về các giao dịch chưa bị xóa (`deleted_at: null`).

## 2. API Lấy Thống Kê Theo Năm

**Mô tả**: Trả về các số liệu thống kê về giao dịch thanh toán và hoàn tiền trong một năm cụ thể, cùng với danh sách các năm có giao dịch.

- **URL**: `/api/payments/stats`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **Query Parameters**:
  - `year` (number, optional, default: năm hiện tại): Năm cần lấy thống kê.
- **Request Example**:
  ```
  GET /api/payments/stats?year=2025
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": {
        "stats": {
          "totalPaymentCount": 100,
          "totalPaymentAmount": 1000000000,
          "totalRefundCount": 10,
          "totalRefundAmount": 50000000,
          "netRevenue": 950000000
        },
        "availableYears": [2025, 2024, 2023]
      },
      "error": null,
      "timestamp": "2025-06-17T16:19:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **400 Bad Request** (nếu năm không hợp lệ):
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Năm không hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép truy cập.
  - `totalPaymentCount` và `totalPaymentAmount` được tính từ các giao dịch có `type: "payment"`, `status: "success"`, và `deleted_at: null` trong năm được chọn.
  - `totalRefundCount` và `totalRefundAmount` được tính từ các giao dịch có `type: "refund"`, `status: "success"`, và `deleted_at: null`.
  - `netRevenue` = `totalPaymentAmount` - `totalRefundAmount`.
  - `availableYears` được lấy từ các năm duy nhất trong `created_at` của `payments`.

## 3. API Thêm Giao Dịch Thanh Toán

**Mô tả**: Tạo một giao dịch thanh toán hoặc hoàn tiền mới trong collection `payments`.

- **URL**: `/api/payments`
- **Method**: `POST`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **Body (Payload)**:
  ```json
  {
    "booking_id": "string",
    "cancellation_id": "string|null",
    "type": "string",
    "amount": "number",
    "payment_method": "string",
    "transaction_id": "string|null",
    "status": "string"
  }
  ```
- **Request Example**:
  ```
  POST /api/payments
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

  {
    "booking_id": "507f1f77bcf86cd799439020",
    "cancellation_id": null,
    "type": "payment",
    "amount": 8390000,
    "payment_method": "bank_transfer",
    "transaction_id": "txn_123456",
    "status": "success"
  }
  ```
- **Response**:
  - **Status Code**: `201 Created`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": {
        "_id": "507f1f77bcf86cd799439023",
        "booking_id": "507f1f77bcf86cd799439020",
        "cancellation_id": null,
        "type": "payment",
        "amount": 8390000,
        "payment_method": "bank_transfer",
        "transaction_id": "txn_123456",
        "status": "success",
        "created_at": "2025-06-17T16:19:00Z",
        "deleted_at": null
      },
      "error": null,
      "timestamp": "2025-06-17T16:19:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **400 Bad Request**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Dữ liệu không hợp lệ.",
          "details": {
            "booking_id": "Booking ID không được để trống.",
            "amount": "Số tiền phải tối thiểu 1.000."
          }
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **404 Not Found**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "NOT_FOUND",
          "message": "Booking hoặc cancellation không tồn tại."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép tạo giao dịch.
  - Validate:
    - `booking_id` phải tồn tại trong `bookings`.
    - `cancellation_id` (nếu có) phải tồn tại trong `cancellations`.
    - `amount` >= 1000.
    - `transaction_id` bắt buộc nếu `payment_method` không phải "cash".
  - `created_at` được tự động thêm, `deleted_at` mặc định là `null`.

## 4. API Xem Chi Tiết Giao Dịch

**Mô tả**: Lấy thông tin chi tiết của một giao dịch dựa trên `_id`, bao gồm thông tin từ `bookings`.

- **URL**: `/api/payments/:id`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **URL Parameters**:
  - `id` (string): ObjectId của giao dịch.
- **Request Example**:
  ```
  GET /api/payments/507f1f77bcf86cd799439023
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": {
        "_id": "507f1f77bcf86cd799439023",
        "booking_id": "507f1f77bcf86cd799439020",
        "cancellation_id": null,
        "type": "payment",
        "amount": 8390000,
        "payment_method": "bank_transfer",
        "transaction_id": "txn_123456",
        "status": "success",
        "created_at": "2025-05-21T23:00:00Z",
        "deleted_at": null,
        "booking_info": {
          "user_name": "Nguyen Van A",
          "tour_name": "Tour Đà Nẵng - Huế 5N4D",
          "total_price": 9390000
        }
      },
      "error": null,
      "timestamp": "2025-06-17T16:19:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **404 Not Found**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "NOT_FOUND",
          "message": "Không tìm thấy giao dịch."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép xem chi tiết.
  - Chỉ trả về giao dịch chưa bị xóa (`deleted_at: null`).
  - `booking_info` được lấy bằng cách join với `bookings` và `tours`.

## 5. API Sửa Giao Dịch

**Mô tả**: Cập nhật thông tin của một giao dịch hiện có dựa trên `_id`.

- **URL**: `/api/payments/:id`
- **Method**: `PUT`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **URL Parameters**:
  - `id` (string): ObjectId của giao dịch.
- **Body (Payload)**:
  ```json
  {
    "booking_id": "string",
    "cancellation_id": "string|null",
    "type": "string",
    "amount": "number",
    "payment_method": "string",
    "transaction_id": "string|null",
    "status": "string"
  }
  ```
- **Request Example**:
  ```
  PUT /api/payments/507f1f77bcf86cd799439023
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

  {
    "booking_id": "507f1f77bcf86cd799439020",
    "cancellation_id": null,
    "type": "payment",
    "amount": 9000000,
    "payment_method": "credit_card",
    "transaction_id": "txn_789012",
    "status": "success"
  }
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": {
        "_id": "507f1f77bcf86cd799439023",
        "booking_id": "507f1f77bcf86cd799439020",
        "cancellation_id": null,
        "type": "payment",
        "amount": 9000000,
        "payment_method": "credit_card",
        "transaction_id": "txn_789012",
        "status": "success",
        "created_at": "2025-05-21T23:00:00Z",
        "deleted_at": null
      },
      "error": null,
      "timestamp": "2025-06-17T16:19:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **400 Bad Request**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Dữ liệu không hợp lệ.",
          "details": {
            "booking_id": "Booking ID không được để trống."
          }
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **404 Not Found**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "NOT_FOUND",
          "message": "Không tìm thấy giao dịch."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép sửa.
  - Validate tương tự API thêm.
  - Chỉ cập nhật các trường được gửi trong payload.

## 6. API Xóa Giao Dịch

**Mô tả**: Xóa giao dịch bằng cách cập nhật `deleted_at` (soft delete).

- **URL**: `/api/payments/:id`
- **Method**: `DELETE`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **URL Parameters**:
  - `id` (string): ObjectId của giao dịch.
- **Request Example**:
  ```
  DELETE /api/payments/507f1f77bcf86cd799439023
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": {
        "message": "Giao dịch đã được xóa."
      },
      "error": null,
      "timestamp": "2025-06-17T16:19:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
    - **404 Not Found**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "NOT_FOUND",
          "message": "Không tìm thấy giao dịch."
        },
        "timestamp": "2025-06-17T16:19:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép xóa.
  - Cập nhật `deleted_at` thay vì xóa vật lý.


  # Đặc Tả API cho Trang Tổng Quan (Overview)

## Tổng quan
Tài liệu này mô tả các API cần thiết để hỗ trợ các chức năng của trang Tổng quan, bao gồm thống kê chính, biểu đồ doanh thu theo tháng, danh sách tour phổ biến và các booking gần đây. Tất cả các API yêu cầu xác thực JWT và chỉ dành cho người dùng admin. Định dạng phản hồi tuân theo cấu trúc của API thanh toán, bao gồm các trường `status`, `data`, `error` và `timestamp`.

## 1. API Lấy Thống Kê Tổng Quan
**Mô tả**: Trả về các số liệu thống kê tổng quan, bao gồm tổng số tour, số chuyến đi, số booking và doanh thu trong một khoảng thời gian cụ thể.

- **URL**: `/api/overview/stats`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **Query Parameters**:
  - `timeRange` (string, optional, default: "30"): Khoảng thời gian cần lấy thống kê (`7` cho 7 ngày, `30` cho 30 ngày, `90` cho 3 tháng, `365` cho 1 năm).
- **Request Example**:
  ```
  GET /api/overview/stats?timeRange=30
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": {
        "totalTours": 50,
        "activeTours": 45,
        "totalDepartures": 120,
        "upcomingDepartures": 20,
        "totalBookings": 300,
        "pendingBookings": 15,
        "totalRevenue": 1500000000,
        "monthlyRevenue": 500000000
      },
      "error": null,
      "timestamp": "2025-06-18T18:24:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
    - **400 Bad Request** (nếu tham số không hợp lệ):
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Tham số timeRange không hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép truy cập.
  - `totalTours`: Đếm số tour trong collection `tours` (chưa bị xóa, `deleted_at: null`).
  - `activeTours`: Đếm số tour có trạng thái `active`.
  - `totalDepartures`: Đếm số chuyến đi từ `departures` trong khoảng thời gian được chọn.
  - `upcomingDepartures`: Đếm số chuyến đi có `departureDate` trong tương lai.
  - `totalBookings`: Đếm số booking từ `bookings` trong khoảng thời gian.
  - `pendingBookings`: Đếm số booking có trạng thái `pending`.
  - `totalRevenue`: Tổng `amount` từ các giao dịch `payment` thành công trong `payments`.
  - `monthlyRevenue`: Tổng `amount` từ các giao dịch `payment` thành công trong tháng hiện tại.
  - Chỉ trả về dữ liệu chưa bị xóa (`deleted_at: null`).

## 2. API Lấy Dữ Liệu Doanh Thu Theo Tháng
**Mô tả**: Trả về dữ liệu doanh thu theo từng tháng trong khoảng thời gian được chọn, dùng để hiển thị biểu đồ doanh thu.

- **URL**: `/api/overview/revenue`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **Query Parameters**:
  - `timeRange` (string, optional, default: "30"): Khoảng thời gian cần lấy dữ liệu (`7`, `30`, `90`, `365`).
- **Request Example**:
  ```
  GET /api/overview/revenue?timeRange=30
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": [
        {
          "month": "1",
          "revenue": 100000000
        },
        {
          "month": "2",
          "revenue": 120000000
        },
        ...
      ],
      "error": null,
      "timestamp": "2025-06-18T18:24:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
    - **400 Bad Request**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Tham số timeRange không hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép truy cập.
  - Dữ liệu được nhóm theo tháng dựa trên `created_at` của các giao dịch `payment` thành công trong `payments`.
  - `month`: Số thứ tự tháng (1-12).
  - `revenue`: Tổng `amount` của các giao dịch `payment` thành công trong tháng đó.
  - Chỉ trả về dữ liệu chưa bị xóa (`deleted_at: null`).

## 3. API Lấy Danh Sách Tour Phổ Biến
**Mô tả**: Trả về danh sách các tour phổ biến nhất dựa trên số lượng booking và doanh thu, kèm theo đánh giá trung bình.

- **URL**: `/api/overview/popular-tours`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **Query Parameters**:
  - `timeRange` (string, optional, default: "30"): Khoảng thời gian cần lấy dữ liệu (`7`, `30`, `90`, `365`).
  - `limit` (number, optional, default: 5): Số lượng tour trả về.
- **Request Example**:
  ```
  GET /api/overview/popular-tours?timeRange=30&limit=5
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "507f1f77bcf86cd799439010",
          "name": "Tour Đà Nẵng - Huế 5N4D",
          "bookings": 50,
          "revenue": 500000000,
          "rating": 4.5
        },
        ...
      ],
      "error": null,
      "timestamp": "2025-06-18T18:24:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
    - **400 Bad Request**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Tham số không hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép truy cập.
  - Dữ liệu được lấy từ `tours`, join với `bookings` và `payments` để tính số lượng booking và doanh thu.
  - `bookings`: Số lượng booking trong khoảng thời gian được chọn.
  - `revenue`: Tổng `amount` từ các giao dịch `payment` thành công liên quan đến tour.
  - `rating`: Điểm đánh giá trung bình từ `reviews` (nếu có).
  - Sắp xếp theo `bookings` hoặc `revenue` (ưu tiên `bookings`).
  - Chỉ trả về các tour chưa bị xóa (`deleted_at: null`).

## 4. API Lấy Danh Sách Booking Gần Đây
**Mô tả**: Trả về danh sách các booking gần đây, bao gồm thông tin mã booking, khách hàng, tour, ngày khởi hành, trạng thái và số tiền.

- **URL**: `/api/overview/recent-bookings`
- **Method**: `GET`
- **Headers**:
  ```
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json
  ```
- **Query Parameters**:
  - `timeRange` (string, optional, default: "30"): Khoảng thời gian cần lấy dữ liệu (`7`, `30`, `90`, `365`).
  - `limit` (number, optional, default: 10): Số lượng booking trả về.
- **Request Example**:
  ```
  GET /api/overview/recent-bookings?timeRange=30&limit=10
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Response**:
  - **Status Code**: `200 OK`
  - **Body**:
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "507f1f77bcf86cd799439020",
          "customerName": "Nguyen Van A",
          "tourName": "Tour Đà Nẵng - Huế 5N4D",
          "departureDate": "2025-07-01T00:00:00Z",
          "status": "confirmed",
          "amount": 9390000
        },
        ...
      ],
      "error": null,
      "timestamp": "2025-06-18T18:24:00Z"
    }
    ```
  - **Error Responses**:
    - **401 Unauthorized**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "UNAUTHORIZED",
          "message": "Không được phép truy cập. Vui lòng cung cấp token hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
    - **400 Bad Request**:
      ```json
      {
        "status": "error",
        "data": null,
        "error": {
          "code": "INVALID_REQUEST",
          "message": "Tham số không hợp lệ."
        },
        "timestamp": "2025-06-18T18:24:00Z"
      }
      ```
- **Ghi chú**:
  - Xác thực JWT là bắt buộc, chỉ admin được phép truy cập.
  - Dữ liệu được lấy từ `bookings`, join với `users`, `tours` và `payments` để lấy thông tin khách hàng, tour và số tiền.
  - `status`: Có thể là `confirmed`, `pending`, `cancelled`.
  - `amount`: Lấy từ `total_price` của booking hoặc `amount` từ giao dịch `payment` thành công.
  - Sắp xếp theo `created_at` giảm dần để lấy các booking gần đây nhất.
  - Chỉ trả về các booking chưa bị xóa (`deleted_at: null`).

## Ghi chú chung
- Tất cả các API đều yêu cầu xác thực JWT và chỉ admin được phép truy cập.
- Định dạng phản hồi tuân theo cấu trúc: `{ status, data, error, timestamp }`.
- Dữ liệu chỉ bao gồm các bản ghi chưa bị xóa (`deleted_at: null`).
- Các tham số `timeRange` được xử lý để lọc dữ liệu trong khoảng thời gian tương ứng (7 ngày, 30 ngày, 3 tháng, hoặc 1 năm).
- Các API join với các collection liên quan (`tours`, `bookings`, `payments`, `users`, `reviews`) để cung cấp thông tin đầy đủ.