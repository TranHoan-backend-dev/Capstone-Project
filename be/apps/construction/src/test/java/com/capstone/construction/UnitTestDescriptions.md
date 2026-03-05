# Mô tả Chi tiết Unit Test cho Construction Service

Tài liệu này mô tả đầy đủ các kịch bản kiểm thử (unit test) cho dịch vụ Construction, được tổ chức theo phương thức gốc trong mã nguồn chính.

---

## 1. Lớp InstallationFormHandlingUseCase

### Phương thức: `getPaginatedInstallationForms`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-01 | Lấy danh sách thành công | Pageable, FilterFormRequest | Trả về Page<InstallationFormListResponse> | Service trả về dữ liệu |

### Phương thức: `createNewInstallationRequest`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-02 | Tạo yêu cầu mới thành công | NewOrderRequest hợp lệ | Lưu thành công và gửi sự kiện thông báo | Form chưa tồn tại |
| UC-03 | Form đã tồn tại | FormNumber và FormCode đã có | Ném `ExistingItemException` (SE_01) | Hệ thống kiểm tra thấy trùng lặp |
| UC-04 | Dữ liệu đầu vào null | request = null | Ném `NullPointerException` | - |

---

## 2. Lớp CommuneServiceImpl

### Phương thức: `createCommune`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-05 | Tạo xã mới thành công | CreateRequest hợp lệ | Lưu xã vào DB | Tên xã chưa tồn tại |
| UC-06 | Tên xã đã tồn tại | Tên xã trùng (không phân biệt hoa thường) | Ném `ExistingItemException` | - |
| UC-07 | Dữ liệu đầu vào null | request = null | Ném `NullPointerException` | - |

### Phương thức: `updateCommune`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-08 | Cập nhật thành công | id hợp lệ, UpdateRequest đầy đủ | Trả về CommuneResponse đã cập nhật | Xã tồn tại, tên mới không trùng |
| UC-09 | Không tìm thấy xã | id không tồn tại | Ném `IllegalArgumentException` | - |
| UC-10 | Tên mới đã tồn tại | Tên xã khác đã sử dụng tên này | Ném `ExistingItemException` | - |
| UC-11 | Giữ nguyên tên cũ | Tên trong request trùng tên hiện tại | Cập nhật các trường khác thành công | - |
| UC-12 | Cập nhật chỉ tên / Chỉ loại | Chỉ truyền name hoặc type | Chỉ cập nhật trường được truyền | - |

### Phương thức: `deleteCommune`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-13 | Xóa thành công | id tồn tại | Xóa xã và các bản ghi liên quan (thôn, tổ) | - |
| UC-14 | Xóa xã không tồn tại | id không có trong DB | Ném `IllegalArgumentException` | - |

### Phương thức: `getCommuneById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-15 | Lấy thông tin thành công | id tồn tại | Trả về CommuneResponse | - |
| UC-16 | Không tìm thấy xã | id không tồn tại | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllCommunes`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-17 | Lấy tất cả thành công | Pageable | Trả về danh sách phân trang | - |

---

## 3. Lớp InstallationFormServiceImpl

### Phương thức: `createNewInstallationForm`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-18 | Tạo form thành công | NewOrderRequest hợp lệ | Lưu DB và trả về response | Nhân viên, mạng lưới tồn tại |
| UC-19 | Nhân viên không tồn tại | createdBy không hợp lệ | Ném `IllegalArgumentException` (PT_61) | - |
| UC-20 | Mạng lưới không tồn tại | networkId không hợp lệ | Ném `IllegalArgumentException` (PT_59) | - |

### Phương thức: `getInstallationForms`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-21 | Lấy danh sách không lọc | Request trống | Trả về toàn bộ danh sách | - |
| UC-22 | Lọc theo từ khóa | keyword | Trả về danh sách khớp từ khóa | - |
| UC-23 | Lọc theo ngày | from, to | Trả về danh sách trong khoảng ngày | - |

### Phương thức: `isInstallationFormExisting`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-24 | Kiểm tra tồn tại | formNumber, formCode | Trả về true/false | - |

---

## 4. Lớp LateralServiceImpl

### Phương thức: `createLateral`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-25 | Tạo tuyến nhánh thành công | LateralRequest hợp lệ | Trả về LateralResponse | Tên chưa tồn tại, mạng lưới tồn tại |
| UC-26 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-27 | Mạng lưới không tồn tại | networkId sai | Ném `IllegalArgumentException` | - |
| UC-28 | Thiếu tên hoặc mạng lưới | Tên/Mạng lưới null | Ném `NullPointerException` (PT_70 / PT_59) | - |

### Phương thức: `updateLateral`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-29 | Cập nhật thành công | id hợp lệ, request đầy đủ | Trả về LateralResponse mới | - |
| UC-30 | Cập nhật chỉ tên | networkId null | Chỉ cập nhật tên | - |
| UC-31 | Tuyến nhánh không tồn tại | id sai | Ném `IllegalArgumentException` | - |
| UC-32 | Tên mới đã tồn tại | Tên trùng tuyến khác | Ném `ExistingItemException` | - |
| UC-33 | Mạng lưới mới không tồn tại | networkId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `deleteLateral`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-34 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-35 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getLateralById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-36 | Lấy thông tin thành công | id tồn tại | Trả về LateralResponse | - |
| UC-37 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllLaterals`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-38 | Lấy tất cả / Lọc | Pageable, keyword, networkId | Trả về danh sách phân trang | - |

---

## 5. Lớp WaterSupplyNetworkServiceImpl

### Phương thức: `createNetwork`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-39 | Tạo mạng lưới thành công | CreateRequest hợp lệ | Lưu vào DB | - |
| UC-40 | Tên bị null | name = null | Ném `NullPointerException` | - |
| UC-41 | Tên trống | name = "" | Ném `IllegalArgumentException` | - |

### Phương thức: `updateNetwork`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-42 | Cập nhật thành công | id hợp lệ, UpdateRequest | Trả về response mới | Mạng lưới tồn tại |
| UC-43 | Tên đã tồn tại | Tên trùng mạng lưới khác | Ném `IllegalArgumentException` (SE_05) | - |
| UC-44 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-45 | Tên null hoặc trống | name = null/"" | Không cập nhật tên | - |

### Phương thức: `deleteNetwork`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-46 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-47 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getNetworkById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-48 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-49 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllNetworks`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-50 | Lấy tất cả / Lọc | Pageable, keyword | Trả về PageResponse | - |

### Phương thức: `networkExists`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-51 | Kiểm tra tồn tại | id | Trả về true/false | - |

---

## 6. Lớp RoadServiceImpl

### Phương thức: `createRoad`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-52 | Tạo đường thành công | RoadRequest hợp lệ | Trả về RoadResponse | Tên chưa tồn tại |
| UC-53 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-54 | Tên trống | name = "" | Ném `IllegalArgumentException` | - |
| UC-55 | Tên bị null | name = null | Ném `NullPointerException` | - |

### Phương thức: `updateRoad`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-56 | Cập nhật thành công | id hợp lệ, request | Trả về response mới | - |
| UC-57 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-58 | Tên mới đã tồn tại | Tên trùng đường khác | Ném `ExistingItemException` | - |

### Phương thức: `deleteRoad`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-59 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-60 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getRoadById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-61 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-62 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllRoads`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-63 | Lấy tất cả thành công | Pageable | Trả về PageResponse | - |

---

## 7. Lớp RoadmapServiceImpl

### Phương thức: `createRoadmap`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-64 | Tạo lộ trình thành công | RoadmapRequest hợp lệ | Trả về RoadmapResponse | Các ID liên quan tồn tại |
| UC-65 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-66 | Tuyến nhánh không tồn tại | lateralId sai | Ném `IllegalArgumentException` (SE_02) | - |
| UC-67 | Mạng lưới không tồn tại | networkId sai | Ném `IllegalArgumentException` (SE_03) | - |
| UC-68 | Tên bị null | name = null | Ném `NullPointerException` (PT_73) | - |

### Phương thức: `updateRoadmap`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-69 | Cập nhật thành công | id hợp lệ, request đầy đủ | Trả về response mới | - |
| UC-70 | Cập nhật chỉ tên | ID liên quan null/trống | Chỉ cập nhật tên | - |
| UC-71 | Tuyến nhánh mới không tồn tại | lateralId sai | Ném `IllegalArgumentException` | - |
| UC-72 | Mạng lưới mới không tồn tại | networkId sai | Ném `IllegalArgumentException` | - |
| UC-73 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-74 | Tên mới đã tồn tại | Tên trùng lộ trình khác | Ném `ExistingItemException` | - |

### Phương thức: `deleteRoadmap`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-75 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-76 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getRoadmapById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-77 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-78 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

---

## 8. Lớp NeighborhoodUnitServiceImpl

### Phương thức: `createUnit`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-79 | Tạo tổ dân phố thành công | NeighborhoodUnitRequest hợp lệ | Lưu vào DB | Tên chưa có, xã tồn tại |
| UC-80 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-81 | Xã không tồn tại | communeId sai | Ném `IllegalArgumentException` (PT_26) | - |
| UC-82 | Tên bị null | name = null | Ném `NullPointerException` | - |

### Phương thức: `updateUnit`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-83 | Cập nhật thành công | id hợp lệ, request | Trả về response mới | - |
| UC-84 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-85 | Tên mới đã tồn tại | Tên trùng tổ khác | Ném `ExistingItemException` | - |
| UC-86 | Xã mới không tồn tại | communeId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `deleteUnit`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-87 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-88 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getUnitById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-89 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-90 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
