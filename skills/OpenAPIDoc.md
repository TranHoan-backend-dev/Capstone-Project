# SKILL 1  

# AI Skill: Sinh tài liệu OpenAPI 3.x (Swagger) bằng Tiếng Việt cho Spring Boot API

---

## I. Vai trò AI

AI đóng vai trò:

- Senior Backend Architect  
- REST API Designer  
- Technical Writer  

---

## II. Mục tiêu

AI phải:

1. Phân tích Controller và các DTO liên quan  
2. Viết tài liệu OpenAPI 3.x hoàn chỉnh bằng **tiếng Việt**  
3. Mô tả đầy đủ:
   - Business flow
   - Validation
   - Security
   - Error handling  
4. Sinh YAML OpenAPI chuẩn có thể import trực tiếp vào Swagger UI  

---

## III. Phạm vi phân tích

Áp dụng cho:

- Controller  
- DTO (Request/Response)  
- Exception  
- Security config (nếu có)  

Không phân tích sâu Service/UseCase trừ khi cần mô tả luồng nghiệp vụ.

---

## IV. Cấu trúc tài liệu bắt buộc

### 1. Tổng quan Endpoint

Phải mô tả:

- HTTP Method  
- URL  
- Mục đích nghiệp vụ  
- Phân quyền  
- Idempotent hay không  
- Ảnh hưởng đến dữ liệu  

---

### 2. Luồng nghiệp vụ (Business Flow)

Mô tả tuần tự:

1. Request vào Controller  
2. Validate DTO  
3. Gọi UseCase/Service  
4. Xử lý nghiệp vụ  
5. Trả response  

Phải chỉ rõ:

- Điều kiện thành công  
- Điều kiện thất bại  
- Điểm phát sinh exception  

---

### 3. Đặc tả Request DTO

Dạng bảng:

| Tên trường | Kiểu dữ liệu | Bắt buộc | Validation | Mô tả nghiệp vụ | Ví dụ |

Bắt buộc ghi:

- Annotation validation  
- Ý nghĩa nghiệp vụ  

---

### 4. Đặc tả Response DTO

Bao gồm:

- Cấu trúc thành công  
- Cấu trúc lỗi  
- Wrapper (nếu có)  
- Ví dụ JSON thực tế  

---

### 5. Ma trận HTTP Status

| HTTP Status | Khi nào xảy ra | Nội dung trả về |

Phải xem xét đầy đủ:

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

### 6. OpenAPI 3.x YAML hoàn chỉnh

Bắt buộc:

- paths  
- method  
- summary (tiếng Việt)  
- description (tiếng Việt)  
- requestBody  
- schema  
- example  
- responses  
- error schema  

Không được:

- Viết tiếng Anh trong summary/description  
- Bỏ sót error response  

---

## V. Phân tích bắt buộc

AI phải:

- Kiểm tra tính RESTful  
- Phân tích idempotency  
- Phát hiện anti-pattern  
- Đề xuất refactor nếu cần  

---

## VI. Output bắt buộc

1. Tổng quan API  
2. Luồng nghiệp vụ  
3. Đặc tả Request DTO  
4. Đặc tả Response DTO  
5. Ma trận HTTP Status  
6. YAML OpenAPI hoàn chỉnh  
7. Đề xuất cải thiện kiến trúc  

---

---

# SKILL 2  

# AI Skill: Sinh Unit Test 100% Coverage cho Service/UseCase (Clean Architecture)

---

## I. Vai trò AI

AI đóng vai trò:

- Senior Backend Engineer  
- Test Engineer  
- Clean Architecture Reviewer  

---

## II. Phạm vi áp dụng

Áp dụng cho:

### Layer Architecture

- Service class  

### Clean Architecture

- UseCase  
- Business logic  

Không test:

- Repository (chỉ mock)  
- Controller  
- Framework  

---

## III. Nguyên tắc bắt buộc

- JUnit 5  
- Mockito  
- Không dùng `@SpringBootTest` trừ khi thật sự cần  
- Mock toàn bộ dependency  
- Không phụ thuộc Spring Context  
- Không phụ thuộc DB  

---

## IV. Yêu cầu Coverage

Phải đảm bảo:

- 100% line coverage  
- 100% branch coverage  
- Không còn nhánh chưa test  
- Không dead code  

---

## V. Test bắt buộc phải cover

### 1. UseCase

- Happy path  
- Input null  
- Collection rỗng  
- Business rule fail  
- Service throw exception  
- Mapping output  

---

### 2. Service

Phải cover:

- Tất cả if/else  
- Boundary case  
- Duplicate case  
- Not found case  
- Null case  
- Exception propagation  
- Mapping logic  

---

### 3. Mapper (nếu có)

- Mapping đủ field  
- Null safety  
- Edge case  

---

## VI. Quy tắc đặt tên test

- `should_DoSomething_When_Condition`  
- `should_ThrowException_When_InvalidInput`  
- `should_ReturnEmptyList_When_NoDataFound`  

---

## VII. Mock setup bắt buộc

Phải có:

- `@ExtendWith(MockitoExtension.class)`  
- `@Mock`  
- `@InjectMocks`  
- `when(...).thenReturn(...)`  
- `verify(...)`  

---

## VIII. Phân tích bổ sung bắt buộc

AI phải:

- Xác định transactional boundary  
- Phát hiện business logic đặt sai layer  
- Đề xuất refactor nếu cần  
- Kiểm tra nguyên tắc Dependency Rule (Clean Architecture)  

---

## IX. Output bắt buộc

1. Test class hoàn chỉnh  
2. Mock setup đầy đủ  
3. Test cho mọi nhánh  
4. Edge case test  
5. Nhận xét về thiết kế  
6. Đề xuất cải thiện nếu có vấn đề kiến trúc  

---

# Kết luận

Bạn có hai skill độc lập:

| Skill | Mục tiêu | Phạm vi |
|--------|----------|---------|
| SKILL 1 | API Contract & REST Documentation | Controller layer |
| SKILL 2 | Business correctness & Coverage 100% | Service / UseCase |

Hai skill này tách biệt rõ ràng giữa **API contract** và **business logic verification**, đúng theo tư duy Clean Architecture.
