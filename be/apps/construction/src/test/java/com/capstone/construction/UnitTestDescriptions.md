# Mô tả Chi tiết Unit Test cho Construction Service

Tài liệu này mô tả đầy đủ các kịch bản kiểm thử (unit test) cho dịch vụ Construction, được tổ chức theo phương thức gốc trong mã nguồn chính.

---

## 1. Lớp InstallationFormHandlingUseCase

### Phương thức: `getPaginatedInstallationForms`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-01 | Lấy danh sách thành công | Pageable, BaseFilterRequest | Trả về Page<InstallationFormListResponse> | Service trả về dữ liệu |

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
| UC-18 | Tạo form thành công | NewOrderRequest hợp lệ | Lưu DB và trả về response | Nhân viên, mạng lưới, đồng hồ tổng tồn tại |
| UC-19 | Tạo form thành công (không có người đại diện) | representative = null | Lưu DB bình thường | - |
| UC-20 | Nhân viên không tồn tại | createdBy không hợp lệ | Ném `IllegalArgumentException` (PT_61) | - |
| UC-21 | Mạng lưới không tồn tại | networkId không hợp lệ | Ném `IllegalArgumentException` (PT_59) | - |
| UC-22 | Đồng hồ tổng không tồn tại | overallWaterMeterId không hợp lệ | Ném `IllegalArgumentException` (SE_06) | - |
| UC-23 | Dữ liệu đầu vào null | request = null | Ném `NullPointerException` | - |

### Phương thức: `getInstallationForms`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-24 | Lấy danh sách không lọc | Request rỗng (null các trường) | Trả về toàn bộ danh sách | Dùng `findAll(pageable)` |
| UC-25 | Lọc theo từ khóa | keyword có giá trị | Trả về danh sách khớp từ khóa | Dùng `findAll(Specification, Pageable)` |
| UC-26 | Lọc theo từ khóa (khoảng trắng) | keyword = "   " | Trả về toàn bộ danh sách | Coi như không lọc |
| UC-27 | Lọc theo khoảng ngày | from, to đầy đủ | Trả về danh sách trong khoảng ngày | - |
| UC-28 | Chỉ truyền ngày bắt đầu | from có, to null | Trả về toàn bộ danh sách | Logic yêu cầu cả 2 ngày |
| UC-29 | Chỉ truyền ngày kết thúc | from null, to có | Trả về toàn bộ danh sách | Logic yêu cầu cả 2 ngày |
| UC-30 | Dữ liệu filter là null | request = null | Ném `NullPointerException` | - |
| UC-31 | Xử lý khi thông tin nhân viên null | Nhân viên không tìm thấy tên | Trả về "Unknown" trong response | Repo trả về dữ liệu |
| UC-32 | Xử lý khi ngày hẹn khảo sát null | scheduleSurveyAt = null | Response trả về null cho trường này | - |

### Phương thức: `isInstallationFormExisting`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-33 | Kiểm tra tồn tại - Có | formNumber hoặc formCode tồn tại | Trả về `true` | - |
| UC-34 | Kiểm tra tồn tại - Không | Cả 2 đều không tồn tại | Trả về `false` | - |

---

## 4. Lớp LateralServiceImpl

### Phương thức: `createLateral`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-35 | Tạo tuyến nhánh thành công | LateralRequest hợp lệ | Trả về LateralResponse | Tên chưa tồn tại, mạng lưới tồn tại |
| UC-36 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-37 | Mạng lưới không tồn tại | networkId sai | Ném `IllegalArgumentException` | - |
| UC-38 | Thiếu tên hoặc mạng lưới | Tên/Mạng lưới null | Ném `NullPointerException` (PT_70 / PT_59) | - |

### Phương thức: `updateLateral`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-39 | Cập nhật thành công | id hợp lệ, request đầy đủ | Trả về LateralResponse mới | - |
| UC-40 | Cập nhật chỉ tên | networkId null | Chỉ cập nhật tên | - |
| UC-41 | Tuyến nhánh không tồn tại | id sai | Ném `IllegalArgumentException` | - |
| UC-42 | Tên mới đã tồn tại | Tên trùng tuyến khác | Ném `ExistingItemException` | - |
| UC-43 | Mạng lưới mới không tồn tại | networkId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `deleteLateral`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-44 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-45 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getLateralById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-46 | Lấy thông tin thành công | id tồn tại | Trả về LateralResponse | - |
| UC-47 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllLaterals`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-48 | Lấy tất cả / Lọc | Pageable, keyword, networkId | Trả về danh sách phân trang | - |

---

## 5. Lớp WaterSupplyNetworkServiceImpl

### Phương thức: `createNetwork`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-49 | Tạo mạng lưới thành công | CreateRequest hợp lệ | Lưu vào DB | - |
| UC-50 | Tên bị null | name = null | Ném `NullPointerException` | - |
| UC-51 | Tên trống | name = "" | Ném `IllegalArgumentException` | - |

### Phương thức: `updateNetwork`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-52 | Cập nhật thành công | id hợp lệ, UpdateRequest | Trả về response mới | Mạng lưới tồn tại |
| UC-53 | Tên đã tồn tại | Tên trùng mạng lưới khác | Ném `IllegalArgumentException` (SE_05) | - |
| UC-54 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-55 | Tên null hoặc trống | name = null/"" | Không cập nhật tên | - |

### Phương thức: `deleteNetwork`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-56 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-57 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getNetworkById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-58 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-59 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllNetworks`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-60 | Lấy tất cả / Lọc | Pageable, keyword | Trả về PageResponse | - |

### Phương thức: `networkExists`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-61 | Kiểm tra tồn tại | id | Trả về true/false | - |

---

## 6. Lớp RoadServiceImpl

### Phương thức: `createRoad`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-62 | Tạo đường thành công | RoadRequest hợp lệ | Trả về RoadResponse | Tên chưa tồn tại |
| UC-63 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-64 | Tên trống | name = "" | Ném `IllegalArgumentException` | - |
| UC-65 | Tên bị null | name = null | Ném `NullPointerException` | - |

### Phương thức: `updateRoad`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-66 | Cập nhật thành công | id hợp lệ, request | Trả về response mới | - |
| UC-67 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-68 | Tên mới đã tồn tại | Tên trùng đường khác | Ném `ExistingItemException` | - |

### Phương thức: `deleteRoad`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-69 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-70 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getRoadById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-71 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-72 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getAllRoads`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-73 | Lấy tất cả thành công | Pageable | Trả về PageResponse | - |

---

## 7. Lớp RoadmapServiceImpl

### Phương thức: `createRoadmap`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-74 | Tạo lộ trình thành công | RoadmapRequest hợp lệ | Trả về RoadmapResponse | Các ID liên quan tồn tại |
| UC-75 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-76 | Tuyến nhánh không tồn tại | lateralId sai | Ném `IllegalArgumentException` (SE_02) | - |
| UC-77 | Mạng lưới không tồn tại | networkId sai | Ném `IllegalArgumentException` (SE_03) | - |
| UC-78 | Tên bị null | name = null | Ném `NullPointerException` (PT_73) | - |

### Phương thức: `updateRoadmap`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-79 | Cập nhật thành công | id hợp lệ, request đầy đủ | Trả về response mới | - |
| UC-80 | Cập nhật chỉ tên | ID liên quan null/trống | Chỉ cập nhật tên | - |
| UC-81 | Tuyến nhánh mới không tồn tại | lateralId sai | Ném `IllegalArgumentException` | - |
| UC-82 | Mạng lưới mới không tồn tại | networkId sai | Ném `IllegalArgumentException` | - |
| UC-83 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-84 | Tên mới đã tồn tại | Tên trùng lộ trình khác | Ném `ExistingItemException` | - |

### Phương thức: `deleteRoadmap`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-85 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-86 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getRoadmapById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-87 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-88 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |

---

## 8. Lớp NeighborhoodUnitServiceImpl

### Phương thức: `createUnit`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-89 | Tạo tổ dân phố thành công | NeighborhoodUnitRequest hợp lệ | Lưu vào DB | Tên chưa có, xã tồn tại |
| UC-90 | Tên đã tồn tại | Tên trùng | Ném `ExistingItemException` | - |
| UC-91 | Xã không tồn tại | communeId sai | Ném `IllegalArgumentException` (PT_26) | - |
| UC-92 | Tên bị null | name = null | Ném `NullPointerException` | - |

### Phương thức: `updateUnit`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-93 | Cập nhật thành công | id hợp lệ, request | Trả về response mới | - |
| UC-94 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
| UC-95 | Tên mới đã tồn tại | Tên trùng tổ khác | Ném `ExistingItemException` | - |
| UC-96 | Xã mới không tồn tại | communeId sai | Ném `IllegalArgumentException` | - |

### Phương thức: `deleteUnit`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-97 | Xóa thành công | id tồn tại | Xóa khỏi DB | - |
| UC-98 | Xóa không tồn tại | id sai | Ném `IllegalArgumentException` | - |

### Phương thức: `getUnitById`

| ID | Trường hợp test | Đầu vào | Kỳ vọng đầu ra | Điều kiện tiên quyết |
|:---|:---|:---|:---|:---|
| UC-99 | Lấy thông tin thành công | id tồn tại | Trả về response | - |
| UC-100 | Không tìm thấy | id sai | Ném `IllegalArgumentException` | - |
