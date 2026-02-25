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
