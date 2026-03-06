# Mô tả Chi tiết Unit Test cho Organization Service

Tài liệu này mô tả đầy đủ các kịch bản kiểm thử (unit test) cho dịch vụ Organization, được tổ chức theo phương thức gốc trong mã nguồn chính.

---

## 1. Lớp DepartmentServiceImpl

### Phương thức: `createDepartment`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-01 | Tạo phòng ban thành công | CreateDepartmentRequest hợp lệ | Trả về DepartmentResponse | - |
| UC-02 | Số điện thoại đã tồn tại | Số điện thoại trùng | Ném `ExistingException` | - |
| UC-03 | Tên đã tồn tại | Tên trùng (không phân biệt hoa thường) | Ném `ExistingException` | - |
| UC-04 | Số điện thoại không hợp lệ | Số điện thoại không đúng 10 chữ số | Ném `IllegalArgumentException` | - |

### Phương thức: `updateDepartment`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-05 | Cập nhật thành công | departmentId tồn tại, UpdateDepartmentRequest hợp lệ | Trả về DepartmentResponse đã cập nhật | - |
| UC-06 | Không tìm thấy phòng ban | departmentId không tồn tại | Ném `IllegalArgumentException` | - |
| UC-07 | Cập nhật số điện thoại đã tồn tại | Số điện thoại mới trùng với phòng ban khác | Ném `ExistingException` | - |
| UC-08 | Cập nhật tên đã tồn tại | Tên mới trùng với phòng ban khác | Ném `ExistingException` | - |
| UC-09 | Không có trường thông tin thay đổi | Các trường trong request null hoặc rỗng | Giữ nguyên giá trị cũ | - |

### Phương thức: `getDepartments`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-10 | Lấy danh sách không theo từ khóa | keyword = null | Trả về toàn bộ danh sách phân trang | - |
| UC-11 | Tìm kiếm theo từ khóa | keyword = "tech" | Trả về danh sách phòng ban khớp từ khóa | - |

### Phương thức: `checkIfDepartmentExists`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-12 | Phòng ban tồn tại | departmentId hợp lệ | Trả về `true` | - |
| UC-13 | Phòng ban không tồn tại | departmentId không có | Trả về `false` | - |

### Phương thức: `deleteDepartment`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-14 | Xóa thành công | departmentId tồn tại | Xóa khỏi DB | - |
| UC-15 | Xóa không thành công - Không tìm thấy | departmentId không có | Ném `IllegalArgumentException` | - |

---

## 2. Lớp BusinessPageServiceImpl

### Phương thức: `createBusinessPage`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-16 | Tạo trang nghiệp vụ thành công | CreateBusinessPageRequest hợp lệ | Trả về BusinessPageResponse | - |
| UC-17 | Tên trang trống | name = "" | Ném `IllegalArgumentException` | - |
| UC-18 | Trạng thái kích hoạt null | activate = null | Ném `NullPointerException` | - |

### Phương thức: `updateBusinessPage`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-19 | Cập nhật thành công | pageId tồn tại, UpdateBusinessPageRequest hợp lệ | Trả về BusinessPageResponse mới | - |
| UC-20 | Cập nhật tên trống | name = " " | Ném `IllegalArgumentException` | - |
| UC-21 | Trang không tồn tại | pageId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getBusinessPages`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-22 | Lấy danh sách thành công | Pageable hợp lệ | Trả về trang response | - |
| UC-23 | Danh sách trống | Không có dữ liệu | Trả về PagedBusinessPageResponse rỗng | - |

### Phương thức: `filterBusinessPagesList`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-24 | Lọc theo tên và trạng thái | FilterBusinessPagesRequest đầy đủ | Trả về danh sách khớp bộ lọc | - |

### Phương thức: `getAllBusinessPageNamesByIds`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-25 | Lấy danh sách tên theo IDs | List of ids | Danh sách các tên tương ứng | - |
| UC-26 | Không tìm thấy IDs nào | List of ids không khớp | Trả về danh sách rỗng | - |

---

## 3. Lớp JobServiceImpl

### Phương thức: `createJob`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-27 | Tạo nghề nghiệp thành công | CreateJobRequest hợp lệ | Trả về JobResponse | - |
| UC-28 | Tên nghề nghiệp trống | name = "" | Ném `IllegalArgumentException` | - |

### Phương thức: `updateJob`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-29 | Cập nhật thành công | jobId tồn tại, UpdateJobRequest đầy đủ | Trả về JobResponse đã cập nhật | - |
| UC-30 | Tên cập nhật không hợp lệ | name = " " | Ném `IllegalArgumentException` | - |
| UC-31 | Nghề nghiệp không tồn tại | jobId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getJobs`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-32 | Lấy danh sách thành công | page, size hợp lệ | Trả về PagedJobResponse | - |
| UC-33 | Không có dữ liệu | page, size | Trả về response rỗng | - |

### Phương thức: `checkExistence`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-34 | Kiểm tra tồn tại - Có | jobId hợp lệ | Trả về `true` | - |
| UC-35 | Kiểm tra tồn tại - Không | jobId không có | Trả về `false` | - |
