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