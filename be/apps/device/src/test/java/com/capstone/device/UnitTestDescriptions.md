# Mô tả Chi tiết Unit Test cho Device Service

Tài liệu này mô tả đầy đủ các kịch bản kiểm thử (unit test) cho dịch vụ Device, được tổ chức theo phương thức gốc trong mã nguồn chính.

---

## 1. Lớp MaterialUseCase

### Phương thức: `create`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-01 | Tạo vật tư thành công | CreateRequest hợp lệ | Trả về MaterialResponse | Service tạo thành công |

### Phương thức: `update`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-02 | Cập nhật và gửi sự kiện | id tồn tại, UpdateRequest | Trả về response mới và gửi event | Vật tư tồn tại |
| UC-03 | Vật tư không tồn tại | id không có | Ném `IllegalArgumentException` | - |

### Phương thức: `delete`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-04 | Xóa và gửi sự kiện | id tồn tại | Service xóa và gửi event | Vật tư tồn tại |
| UC-05 | Vật tư không tồn tại | id không có | Ném `IllegalArgumentException` | - |

### Phương thức: `get`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-06 | Lấy thông tin thành công | id tồn tại | Trả về MaterialResponse | - |

### Phương thức: `getAll`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-07 | Lấy tất cả thành công | Pageable | Trả về danh sách phân trang | - |

---

## 2. Lớp ParameterUseCase

### Phương thức: `getParametersList`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-08 | Lấy danh sách tham số | Pageable, filter | Trả về Page<ParameterResponse> | - |

---

## 3. Lớp UnitUseCase

### Phương thức: `getUnits`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-09 | Lấy danh sách thành công | Pageable, filter | Trả về Page<UnitResponse> | - |
| UC-10 | Không có dữ liệu | filter không khớp | Trả về trang trống | - |

---

## 4. Lớp MaterialServiceImpl

### Phương thức: `createMaterial`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-11 | Tạo vật tư thành công | CreateRequest hợp lệ | Lưu DB và trả về response | Nhóm vật tư, đơn vị tồn tại |
| UC-12 | Nhóm vật tư không tìm thấy | groupId sai | Ném `IllegalArgumentException` | - |
| UC-13 | Đơn vị không tìm thấy | unitId sai | Ném `IllegalArgumentException` | - |
| UC-14 | Dữ liệu đầu vào null | request = null | Ném `NullPointerException` | - |

### Phương thức: `updateMaterial`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-15 | Cập nhật thành công | id hợp lệ, request đầy đủ | Cập nhật và trả về response | - |
| UC-16 | Cập nhật trường không null | request có một số trường null | Chỉ cập nhật trường có dữ liệu | - |
| UC-17 | Vật tư không tồn tại | id sai | Ném `IllegalArgumentException` | - |
| UC-18 | Request null | id, null | Ném `NullPointerException` | - |

### Phương thức: `deleteMaterial`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-19 | Xóa thành công | id tồn tại | Xóa vật tư và các bản ghi liên quan | - |
| UC-20 | Vật tư không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getMaterialById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-21 | Lấy thông tin thành công | id tồn tại | Trả về MaterialResponse | - |
| UC-22 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-23 | Mapping nhóm/đơn vị null | id tồn tại (nhóm/đơn vị null) | Trả về response với name = null | - |

### Phương thức: `getAllMaterials`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-24 | Lấy tất cả thành công | Pageable | Trả về trang response | - |

### Phương thức: `materialExists`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-25 | Kiểm tra tồn tại | id | Trả về true/false | - |

---

## 5. Lớp ParameterServiceImpl

### Phương thức: `getParameters`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-26 | Lọc theo UUID (người tạo/sửa) | filter là UUID | Gọi repository tìm theo creator/updator | - |
| UC-27 | Lọc theo tên | filter là chuỗi thường | Gọi repository tìm theo tên | - |
| UC-28 | Không dùng bộ lọc | filter null hoặc "" | Trả về tất cả | - |
| UC-29 | Không có dữ liệu | filter không khớp | Trả về trang trống | - |

---

## 6. Lớp UnitServiceImpl

### Phương thức: `getPaginatedUnits`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-30 | Lấy tất cả thành công | filter = null | Trả về toàn bộ danh sách | - |
| UC-31 | Lọc theo tên | filter != null | Trả về danh sách khớp tên | - |

---

## 7. Lớp MeterTypeServiceImpl

### Phương thức: `createMeterType`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-32 | Tạo loại đồng hồ thành công | CreateRequest hợp lệ | Lưu DB | Tên chưa tồn tại |
| UC-33 | Tên đã tồn tại | Tên trùng | Ném `IllegalArgumentException` | - |
| UC-34 | Dữ liệu đầu vào null | request = null | Ném `NullPointerException` | - |

### Phương thức: `updateMeterType`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-35 | Cập nhật thành công | id hợp lệ, UpdateRequest | Trả về response mới | Loại đồng hồ tồn tại |
| UC-36 | Cập nhật từng phần | Request có trường null | Chỉ cập nhật trường được truyền | - |
| UC-37 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `deleteMeterType`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-38 | Xóa thành công | id tồn tại | Xóa khỏi DB | Không có đồng hồ nào đang dùng loại này |
| UC-39 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-40 | Đang được sử dụng | id có liên kết | Ném `ExistingException` | - |

### Phương thức: `getMeterTypeById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-41 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-42 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllMeterTypes`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-43 | Lấy tất cả thành công | Pageable | Trả về PageResponse | - |

---

## 8. Lớp WaterPriceServiceImpl

### Phương thức: `createWaterPrice`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-44 | Tạo giá nước thành công | CreateRequest tiêu chuẩn | Lưu DB | - |
| UC-45 | Dữ liệu đầu vào null | request = null | Ném `NullPointerException` | - |

### Phương thức: `updateWaterPrice`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-46 | Cập nhật thành công | id hợp lệ, UpdateRequest | Trả về response mới | Giá nước tồn tại |
| UC-47 | Cập nhật từng phần | Request có trường null | Không ghi đè trường cũ bằng null | - |
| UC-48 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `deleteWaterPrice`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-49 | Xóa thành công | id tồn tại | Xóa khỏi DB | Chưa áp dụng cho nhân viên nào |
| UC-50 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-51 | Đang áp dụng | id đang dùng | Ném `ExistingException` | - |

### Phương thức: `getWaterPriceById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-52 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-53 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllWaterPrices`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-54 | Lấy tất cả không lọc | keyword = null | Trả về toàn bộ danh sách | - |
| UC-55 | Lọc theo ngày | keyword != null | Trả về danh sách khớp ngày | - |

---

## 9. Lớp WaterMeterServiceImpl

### Phương thức: `createWaterMeter`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-56 | Tạo đồng hồ thành công | WaterMeterRequest hợp lệ | Lưu DB | Loại đồng hồ tồn tại |
| UC-57 | Loại đồng hồ không tồn tại | typeId sai | Ném `IllegalArgumentException` | - |
| UC-58 | Dữ liệu đầu vào null | request = null | Ném `NullPointerException` | - |

### Phương thức: `updateWaterMeter`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-59 | Cập nhật thành công | id hợp lệ, request đầy đủ | Cập nhật thành công | Đồng hồ và Loại mới tồn tại |
| UC-60 | Đồng hồ không tồn tại | id sai | Ném `IllegalArgumentException` | - |
| UC-61 | Loại đồng hồ mới không tồn tại | typeId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `deleteWaterMeter`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-62 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-63 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getWaterMeterById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-64 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-65 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllWaterMeters`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-66 | Lấy danh sách thành công | Pageable | Trả về trang response | - |

### Phương thức: `isWaterMeterExisting`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-67 | Kiểm tra tồn tại | id | Trả về true/false | - |

### Phương thức: `deleteOverallWaterMeterByLateralId`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-68 | Xóa đồng hồ tổng theo tuyến | lateralId | Xóa nếu tồn tại | - |
| UC-69 | Tuyến không có đồng hồ tổng | lateralId không khớp | Không thực hiện xóa | - |

---

## 10. Lớp MeterTypeUseCase

### Phương thức: `create`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-70 | Tạo thành công | CreateRequest | Trả về response | - |

### Phương thức: `update`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-71 | Cập nhật thành công | id, UpdateRequest | Trả về response | - |

### Phương thức: `delete`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-72 | Xóa thành công | id | Gọi service xóa | - |

### Phương thức: `get`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-73 | Lấy theo ID | id | Trả về response | - |

### Phương thức: `getAll`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-74 | Lấy tất cả | Pageable | Trả về PageResponse | - |

---

## 11. Lớp WaterMeterUseCase

### Phương thức: `checkExistence`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-75 | Kiểm tra tồn tại | id | Trả về true/false | - |

---

## 12. Lớp WaterPriceUseCase

### Phương thức: `createPrice`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-76 | Tạo thành công | CreateRequest | Trả về response | - |

### Phương thức: `updatePrice`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-77 | Cập nhật thành công | id, UpdateRequest | Trả về response | - |

### Phương thức: `deletePrice`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-78 | Xóa thành công | id | Gọi service xóa | - |

### Phương thức: `getPrice`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-79 | Lấy theo ID | id | Trả về response | - |

### Phương thức: `getAllPrices`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-80 | Lấy danh sách | Pageable, keyword | Trả về trang response | - |
