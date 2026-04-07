# Thiết kế Hệ thống Duyệt Chỉ số Đồng hồ Nước (Hybrid Model)

## 1. Tổng quan
Hệ thống được thiết kế để hỗ trợ nhân viên ghi chỉ số nước chụp ảnh đồng hồ, phân tích bằng AI và duyệt lại kết quả vào cuối ngày theo phong cách **Tinder (Swipe right to approve, left to reject)**.

Mô hình lựa chọn là **Hybrid**: kết hợp giữa đồng bộ dữ liệu Backend và Cache cục bộ trên Mobile để đảm bảo tốc độ phản hồi cực nhanh (60fps) khi duyệt.

---

## 2. Các giai đoạn phát triển

### Giai đoạn 1: Chụp ảnh & Xử lý thời gian thực (Đã thực hiện)
Trong giai đoạn này, khi người dùng chụp ảnh:
1.  **Mobile**: Gửi ảnh lên server qua API `/usage/analyze`.
2.  **Backend**:
    *   Upload ảnh gốc lên Google Cloud Storage (GCS).
    *   Sử dụng AI-Service để trích xuất `index` (chỉ số) và `serial` (mã đồng hồ).
    *   **Tự động tạo bản ghi**: Nếu xác định được Serial (từ AI hoặc từ `customerId` truyền lên), Backend sẽ tạo một bản ghi `Usage` với trạng thái `PENDING` (chờ duyệt).
    *   Trả về `record_id` của bản ghi vừa tạo.
3.  **Mobile Cache**: Lưu toàn bộ kết quả AI + `record_id` + `photoUri` (đường dẫn ảnh local) vào `AsyncStorage` thông qua `localCapturedService`.

### Giai đoạn 2: Màn hình Duyệt cuối ngày (Tinder UI)
Đây là giai đoạn tiếp theo để hoàn thiện luồng công việc:
1.  **Khởi tạo danh sách**:
    *   Ưu tiên lấy dữ liệu từ `localCapturedService.getAuditRecords()`.
    *   Ảnh được hiển thị từ bộ nhớ máy (`photoUri`) giúp tốc độ load gần như tức thì.
2.  **Logic "Tinder"**:
    *   **Vuốt Phải (Approve)**: Gửi lệnh `POST /usage/confirm/{id}` với trạng thái `APPROVED`.
    *   **Vuốt Trái (Reject/Edit)**: Cho phép sửa lại chỉ số/serial và sau đó gửi `APPROVED` hoặc `REJECTED`.
3.  **Xử lý trường hợp không có Serial**:
    *   Nếu AI và Backend đều không xác định được Serial, người dùng sẽ chọn khách hàng từ danh sách đồng bộ sẵn (Customer Data).
4.  **Đồng bộ hóa**:
    *   Đảm bảo mọi thay đổi trên Mobile được cập nhật lên Backend qua API xác nhận.

---

## 3. Cấu trúc dữ liệu Local Cache (AuditRecord)
Mỗi bản ghi được lưu trữ cục bộ bao gồm:
- `id`: ID quản lý trên Server.
- `customerId`: Mã khách hàng (nếu có).
- `photoUri`: Đường dẫn ảnh trong máy điện thoại.
- `aiIndex`: Chỉ số do AI gợi ý.
- `aiSerial`: Số serial do AI gợi ý.
- `timestamp`: Thời gian ghi nhận.

## 4. Lợi ích của giải pháp Hybrid
- **Tốc độ (Speed)**: Tinder UI mượt mà nhờ load ảnh local.
- **Offline support**: Có thể duyệt chỉ số mà không cần kết nối internet liên tục.
- **Độ chính xác**: Backend tự động tìm kiếm thông tin khách hàng dựa trên Serial để giảm thiểu nhập liệu tay.
