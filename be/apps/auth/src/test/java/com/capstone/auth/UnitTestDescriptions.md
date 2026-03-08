# Mô tả Chi tiết Unit Test cho Auth Service

Tài liệu này mô tả đầy đủ các kịch bản kiểm thử (unit test) cho dịch vụ Auth, được tổ chức theo phương thức gốc trong mã nguồn chính.

---

## 1. Lớp AuthUseCase

### Phương thức: `login`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-01 | Đăng nhập thành công | userId, email, username hợp lệ | Trả về ProfileDTO chứa thông tin người dùng | User và Profile tồn tại và trùng khớp thông tin |
| UC-02 | Email không hợp lệ | email sai định dạng | Ném `IllegalArgumentException` (PT_01) | - |
| UC-03 | Tài khoản bị khóa | Thông tin user có `isLocked = true` | Ném `AccountBlockedException` (SE_07) | User tồn tại nhưng bị khóa |
| UC-04 | Email/Username không tồn tại | Email/Username không có trong hệ thống | Ném `NotExistingException` (SE_05) | Hệ thống kiểm tra không thấy thông tin |
| UC-05 | ID người dùng không tồn tại | userId không có trong DB | Ném `NullPointerException` (SE_04) | Trả về null khi tìm theo ID |
| UC-06 | Email không khớp | email truyền vào khác với email của user | Ném `IllegalArgumentException` ("Email does not match") | User tồn tại nhưng email không đúng |
| UC-07 | Username không khớp | username truyền vào khác với username user | Ném `IllegalArgumentException` ("Username does not match") | User tồn tại nhưng username không đúng |
| UC-08 | Không tìm thấy Profile | userId hợp lệ nhưng không có Profile | Ném `NullPointerException` (SE_06) | User tồn tại nhưng Profile thiếu |

### Phương thức: `register`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-09 | Đăng ký thành công | NewUserRequest đầy đủ và hợp lệ | Tạo thành công Employee, User trên Keycloak và gửi event | Role tồn tại, Username chưa có trên Keycloak |
| UC-10 | Thiếu Username | NewUserRequest có username = null | Ném `NullPointerException` (PT_05) | - |
| UC-11 | Thiếu Email | NewUserRequest có email = null | Ném `NullPointerException` (PT_03) | - |
| UC-12 | Thiếu Role | NewUserRequest có role = null | Ném `NullPointerException` (PT_23) | - |
| UC-13 | Thiếu JobIds | NewUserRequest có jobIds = null | Ném `NullPointerException` (PT_20) | - |
| UC-14 | Thiếu DepartmentId | NewUserRequest có departmentId = null | Ném `NullPointerException` (PT_19) | - |
| UC-15 | Thiếu NetworkId | NewUserRequest có waterSupplyNetworkId = null | Ném `NullPointerException` (PT_18) | - |
| UC-16 | Không tìm thấy Role | roleName không có trong hệ thống | Ném `NullPointerException` (SE_08) | RoleService trả về null |
| UC-17 | Tên Role không hợp lệ | roleName sai định dạng enum | Ném `IllegalArgumentException` | RoleName không nằm trong tập hợp cho phép |
| UC-18 | Trùng Username trên Keycloak | username đã tồn tại trên Keycloak | Ném `IllegalArgumentException` ("Username already exists") | Keycloak trả về user khi search |
| UC-19 | Lỗi phản hồi từ Keycloak | Phản hồi từ Keycloak thiếu header Location | Ném `IllegalArgumentException` ("No location header found") | Keycloak tạo user thành công nhưng trả về thiếu thông tin |

---

## 2. Lớp ProfileUseCase

### Phương thức: `getMe`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-20 | Lấy thông tin thành công | userId, email, username hợp lệ | Trả về Profile response đầy đủ thông tin | User và Profile tồn tại và hợp lệ |
| UC-21 | Tài khoản bị khóa | ID của user đang bị khóa | Ném `DisabledException` (SE_07) | `isLocked = true` |
| UC-22 | Email không khớp | email truyền vào sai | Ném `IllegalArgumentException` ("Email does not match") | - |
| UC-23 | Username không khớp | username truyền vào sai | Ném `IllegalArgumentException` ("Username does not match") | - |
| UC-24 | Không tìm thấy User | ID không tồn tại | Ném `NotExistingException` | - |
| UC-25 | Email null hoặc sai định dạng | email = null hoặc "invalid" | Ném `IllegalArgumentException` (PT_01) | - |
| UC-26 | Username bị null | username = null | Ném `IllegalArgumentException` (PT_05) | - |
| UC-27 | Không tìm thấy Profile | User tồn tại nhưng Profile không có | Ném `NotExistingException` | - |

### Phương thức: `updateAvatar`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-28 | Cập nhật thành công | userId và MultipartFile hợp lệ | Trả về Profile response với URL ảnh mới | Tài khoản không bị khóa |
| UC-29 | Tài khoản bị khóa | ID của user bị khóa | Ném `DisabledException` (SE_07) | `isLocked = true` |
| UC-30 | Không tìm thấy User | ID không tồn tại | Ném `NotExistingException` | - |
| UC-31 | URL ảnh không khớp | URL trả về sau cập nhật khác mong đợi | Ném `IncompatibleAvatarException` | URL DB trả về khác URL mong muốn |
| UC-32 | File null | MultipartFile = null | Vẫn xử lý thành công | - |
| UC-33 | Định dạng dữ liệu trả về | Profile có birthday, gender cụ thể | Trả về chuỗi định dạng (ISO date, "true"/"false") | Profile chứa dữ liệu thô hợp lệ |

---

## 3. Lớp UsersUseCase

### Phương thức: `getPaginatedListOfEmployees`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-34 | Lấy danh sách thành công | Pageable, FilterUsersRequest | Trả về Page<EmployeeResponse> | UserService hoạt động bình thường |
| UC-35 | Lỗi xử lý dịch vụ | Bất kỳ đầu vào nào | Ném `RuntimeException` | UserService xảy ra lỗi nội bộ |

### Phương thức: `getListOfPagesByEmployeeId`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-36 | Lấy danh sách thành công | employeeId hợp lệ | Trả về danh sách tên các trang | Nhân viên có trang nghiệp vụ |
| UC-37 | Nhân viên không có trang | employeeId không có trang | Trả về danh sách trống | - |

### Phương thức: `updateBusinessPagesListOfEmployee`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-38 | Cập nhật thành công | List các yêu cầu hợp lệ | Gọi BusinessPageService để cập nhật cho từng emp | - |
| UC-39 | Danh sách yêu cầu rỗng | List trống `[]` | Không làm gì cả, không gọi service | - |
| UC-40 | Lỗi khi cập nhật | List yêu cầu | Ném exception tương ứng từ service | BusinessPageService xảy ra lỗi |

### Phương thức: `checkIfEmployeeExists`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-41 | Nhân viên tồn tại | employeeId đúng | Trả về `true` | - |
| UC-42 | Nhân viên không tồn tại | employeeId sai | Trả về `false` | - |

---

## 4. Lớp BusinessPageServiceImpl

### Phương thức: `getPagesByEmployeeId`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-43 | Lấy trang thành công | employeeId | Trả về danh sách tên trang từ OrganizationService | Có bản ghi liên kết trong DB |
| UC-44 | Nhân viên không có trang | employeeId | Trả về danh sách trống | DB không có bản ghi liên kết |

### Phương thức: `updatePagesOfEmployee`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-45 | Cập nhật trang nhân viên | employeeId, Set<String> pageIds | Thực hiện: xóa tạm, thêm mới vào bảng tạm, xóa chính, lưu chính | - |
| UC-46 | Cập nhật với tập hợp rỗng | employeeId, Set trống | Xóa toàn bộ quyền cũ thành công | - |
| UC-47 | Lỗi database khi cập nhật | employeeId, pageIds | Ném `RuntimeException` | Lỗi xảy ra tại repository hoặc temp service |

---

## 5. Lớp ProfileServiceImpl

### Phương thức: `getProfileById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-48 | Tìm kiếm profile thành công | id (UUID) tồn tại | Trả về ProfileDTO đầy đủ thông tin | Profile có trong DB |
| UC-49 | Profile không tồn tại | id không có trong DB | Ném `NotExistingException` | - |
| UC-50 | ID đầu vào bị null | null | Ném `NullPointerException` | - |
| UC-51 | Profile có dữ liệu rỗng | Profile entity có các trường null | Trả về chuỗi rỗng cho avatarUrl/address/gender/birthday | - |

### Phương thức: `getProfileByCredentials`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-52 | Tìm bằng thông tin đăng nhập | email hoặc username | Trả về ProfileDTO | Thông tin tồn tại |
| UC-53 | Email không tồn tại | email sai | Ném `NotExistingException` | - |
| UC-54 | Username không tồn tại | username sai | Ném `NotExistingException` | - |
| UC-55 | Giá trị đầu vào null | null | Ném `NullPointerException` | - |

### Phương thức: `updateAvatar`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-56 | Cập nhật thành công | id, avatarUrl | Cập nhật DB và trả về DTO mới | Profile tồn tại |
| UC-57 | Profile không tồn tại khi update | id sai | Ném `NotExistingException` | - |
| UC-58 | Cập nhật URL null/rỗng | null hoặc "" | Chấp nhận và lưu vào DB | - |

---

## 6. Lớp RoleServiceImpl

### Phương thức: `getRoleNameById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-59 | Lấy tên thành công | id tồn tại | Trả về tên Role dạng String | - |
| UC-60 | Lấy tên thất bại | id không tồn tại | Ném `NotExistingException` (SE_08) | - |

### Phương thức: `getRoleById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-61 | Lấy đối tượng thành công | id tồn tại | Trả về entity Roles | - |
| UC-62 | Lấy đối tượng thất bại | id không tồn tại | Ném `NotExistingException` (SE_08) | - |

### Phương thức: `getRoleByName`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-63 | Tìm Role theo tên | RoleName (enum) | Trả về entity Roles | Tên role có trong DB |
| UC-64 | Tên Role không tìm thấy | RoleName không có trong DB | Trả về null | - |

---

## 7. Lớp UserServiceImpl

### Phương thức: `createEmployee`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-65 | Tạo nhân viên thành công | Thông tin hợp lệ, Role, Jobs... | Lưu vào 3 bảng: Users, Profile, EmployeeJob | Dữ liệu phòng ban, công việc tồn tại |
| UC-66 | Trùng Email | email đã tồn tại | Ném `ExistingException` (SE_01) | - |
| UC-67 | Trùng Số điện thoại | phone đã tồn tại | Ném `ExistingException` (SE_09) | - |
| UC-68 | Mạng lưới/Phòng ban ko tồn tại | networkId hoặc deptId sai | Ném `NotExistingException` | - |
| UC-69 | Công việc (Job) ko tồn tại | List jobIds chứa id sai | Ném `NotExistingException` | - |

### Phương thức: `checkExistence`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-70 | Kiểm tra bằng Email | "<test@gmail.com>" | Trả về true/false | Sử dụng repo.existsByEmail |
| UC-71 | Kiểm tra bằng Username | "testuser" | Trả về true/false | Sử dụng repo.existsByUsername |
| UC-72 | Giá trị đầu vào null | null | Ném `NullPointerException` | - |

### Phương thức: `isUserExists`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-73 | Kiểm tra ID tồn tại | userId | Trả về true/false | - |

### Phương thức: `getUserById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-74 | Lấy User thành công | userId | Trả về UserDTO kèm thông tin pages | User ID tồn tại |
| UC-75 | Lấy User thất bại | userId sai | Ném `NotExistingException` | - |

### Phương thức: `getUserByEmail`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-76 | Tìm bằng Email thành công | email tồn tại | Trả về UserDTO | - |
| UC-77 | Email không tồn tại | email sai | Ném `NotExistingException` (SE_02) | - |

### Phương thức: `updateUsername`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-78 | Đổi tên đăng nhập thành công | userId, newUsername | Cập nhật DB và trả về DTO mới | User tồn tại |
| UC-79 | Đổi tên đăng nhập thất bại | userId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllEmployeesWithStatus`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-80 | Lọc mặc định | Filter rỗng hoặc null | Trả về toàn bộ danh sách | - |
| UC-81 | Lọc theo trạng thái active | enabled=true | Trả về nhân viên đang hoạt động | - |
| UC-82 | Lọc theo tên | username="abc" | Trả về nhân viên khớp tên | - |
| UC-83 | Lọc theo cả trạng thái và tên | cả hai tham số | Trả về nhân viên khớp cả hai | - |

### Phương thức: `updatePassword`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-84 | Cập nhật mật khẩu | email, info | Luôn ném `IllegalArgumentException` (Tạm thời) | - |

### Phương thức: `resetPassword`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-85 | Đặt lại mật khẩu | email, newPassword | Tìm user và hoàn tất | User tồn tại |

### Phương thức: `hashPassword`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-86 | Băm mật khẩu thành công | rawPassword | Trả về CompletableFuture chứa chuỗi đã băm | - |
| UC-87 | Băm mật khẩu bị lỗi | (Internal) | Ném exception tương ứng | - |
