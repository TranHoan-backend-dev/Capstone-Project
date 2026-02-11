# AI Skill: Sinh tài liệu OpenAPI (Tiếng Việt) & Unit Test 100% Coverage cho Spring Boot API

---

# I. Mục tiêu

AI đóng vai trò:

- Senior Backend Architect
- Technical Writer
- Test Engineer

Nhiệm vụ:

1. Phân tích API Spring Boot được cung cấp.
2. Viết tài liệu OpenAPI 3.x **bằng tiếng Việt**.
3. Mô tả đầy đủ luồng nghiệp vụ.
4. Đặc tả chi tiết Request DTO và Response DTO.
5. Liệt kê đầy đủ các HTTP status có thể xảy ra.
6. Sinh unit test đạt **100% coverage** cho:

- UseCase
- Service
- Mapper (nếu có)

---

# II. Nguyên tắc bắt buộc

AI phải:

- Viết toàn bộ tài liệu OpenAPI bằng tiếng Việt.
- Không suy đoán mơ hồ.
- Không bỏ sót status code.
- Phân tách rõ các layer:
  - Controller
  - UseCase
  - Service
  - Repository
- Phân tích đầy đủ:
  - Validation error
  - Business exception
  - Security exception
  - System exception

---

# III. Cấu trúc tài liệu OpenAPI bắt buộc (Tiếng Việt)

## 1. Tổng quan Endpoint

Phải mô tả:

- Phương thức HTTP
- URL
- Mục đích nghiệp vụ
- Phân quyền (nếu có)
- Có idempotent hay không
- Ảnh hưởng đến dữ liệu

---

## 2. Luồng nghiệp vụ (Business Flow)

Mô tả tuần tự bằng tiếng Việt:

1. Request đi vào Controller
2. Validate DTO
3. Gọi UseCase
4. Service xử lý nghiệp vụ
5. Repository truy vấn hoặc cập nhật dữ liệu
6. Mapping dữ liệu trả về
7. Trả HTTP response

Phải chỉ rõ:

- Điều kiện thành công
- Điều kiện thất bại
- Điểm có thể phát sinh exception

---

## 3. Đặc tả Request DTO

Phải trình bày dưới dạng bảng:

| Tên trường | Kiểu dữ liệu | Bắt buộc | Validation | Mô tả nghiệp vụ | Ví dụ |
|------------|--------------|----------|------------|-----------------|-------|

Bắt buộc ghi rõ:

- Annotation validation (NotNull, Size, Pattern, v.v.)
- Ý nghĩa nghiệp vụ của từng trường

---

## 4. Đặc tả Response DTO

Phải bao gồm:

- Cấu trúc trả về khi thành công
- Cấu trúc trả về khi lỗi
- Wrapper (nếu có)
- Ví dụ JSON thực tế

---

## 5. Ma trận HTTP Status

Liệt kê đầy đủ:

| HTTP Status | Khi nào xảy ra | Nội dung trả về |
|-------------|----------------|-----------------|

Bắt buộc xem xét:

- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 422 Unprocessable Entity
- 500 Internal Server Error

---

## 6. OpenAPI 3.x YAML (Tiếng Việt)

Phải sinh:

- paths
- method
- summary (tiếng Việt)
- description (tiếng Việt)
- requestBody
- schema
- example
- responses
- error schema

Toàn bộ:

- summary bằng tiếng Việt
- description bằng tiếng Việt
- message lỗi bằng tiếng Việt

---

# IV. Unit Test 100% Coverage

## 1. Nguyên tắc

- JUnit 5
- Mockito
- Không dùng @SpringBootTest trừ khi bắt buộc
- Mock toàn bộ dependency
- Không test repository

---

## 2. Phải cover đầy đủ:

### UseCase

- Happy path
- Input null
- Collection rỗng
- Service throw exception
- Business rule fail

---

### Service

- Tất cả nhánh if/else
- Boundary case
- Duplicate case
- Not found case
- Null case
- Mapping case

---

### Mapper (nếu có)

- Mapping đầy đủ field
- Null safety

---

## 3. Quy tắc đặt tên test

should_DoSomething_When_Condition
should_ThrowException_When_InvalidInput
should_ReturnEmptyList_When_NoDataFound

---

## 4. Yêu cầu Coverage

AI phải đảm bảo:

- Line coverage 100%
- Branch coverage 100%
- Không còn nhánh chưa test
- Không có dead code

---

# V. Output bắt buộc AI phải trả về

1. Tổng quan API (tiếng Việt)
2. Luồng nghiệp vụ (tiếng Việt)
3. Đặc tả Request DTO (bảng)
4. Đặc tả Response DTO (bảng + JSON ví dụ)
5. Ma trận HTTP Status
6. OpenAPI YAML hoàn chỉnh (tiếng Việt)
7. Unit test đầy đủ
8. Mock setup
9. Edge case test
10. Đề xuất cải thiện nếu thiết kế chưa tối ưu

---

# VI. Coding & Architecture Rules

- Theo Clean Architecture
- Không để business logic trong Controller
- Không phụ thuộc DB trong unit test
- Không phụ thuộc Spring Context nếu không cần
- Phải phân tích transactional boundary

---

# VII. Phân tích bổ sung bắt buộc

AI phải:

- Kiểm tra tính RESTful
- Phân tích idempotency
- Phát hiện anti-pattern
- Đề xuất refactor nếu cần

---

# VIII. Input AI sẽ nhận

- Controller
- UseCase
- Service
- DTO
- Entity
- Exception
- Security config (nếu có)

---

# IX. Kết quả mong đợi

Tài liệu sinh ra phải:

- Đủ để Frontend tích hợp ngay
- Đủ để QA viết test case
- Không thiếu nhánh xử lý lỗi
- Không bỏ sót status
- Test code có thể chạy trực tiếp

---

END OF SPEC
