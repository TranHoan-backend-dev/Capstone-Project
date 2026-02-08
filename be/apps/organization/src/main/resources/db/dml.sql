DO
$$
  BEGIN
    -- Business Page (25 records)
    INSERT INTO public.business_page (page_id, activate, creator, name, updator)
    VALUES (gen_random_uuid(), true, 'admin', 'Trang chủ', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Lập hợp đồng cấp nước mới', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Đơn lắp đặt mới', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Tra cứu đơn lắp đặt mới', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Tra cứu khách hàng', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Khôi phục khách hàng hủy', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Nhập khách hàng mới', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Danh sách đơn chờ dự toán', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Danh sách đơn chờ duyệt dự toán', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Danh sách đơn từ chối duyệt dự toán', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Danh sách đơn đã phân công khảo sát', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Danh sách khách hàng gọi điện', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Xử lý đơn chờ thiết kế & Thiết kế', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Phân công khảo sát thiết kế', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Duyệt dự toán', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Chạy dự toán', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Tra cứu dự toán', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Quản lý mẫu bốc vật tư', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Tra cứu quyết toán', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Kiểm tra chỉ số bằng hình ảnh', 'admin'),
           (gen_random_uuid(), true, 'admin', 'Hồ sơ khách hàng', 'admin');

-- Department (5 records)
    INSERT INTO public.department (department_id, name, phone_number)
    VALUES ('DEPT-001', 'Phòng Kế hoạch Kỹ Thuật', '02283638708'),
           ('DEPT-002', 'Phòng Thi công', null),
           ('DEPT-003', 'Phòng Kinh doanh', null),
           ('DEPT-004', 'Phòng Tài vụ', null),
           ('DEPT-005', 'Phòng Tin học', '02283636681'),
           ('DEPT-006', 'Chi nhánh Kinh doanh NS NĐ', null),
           ('DEPT-007', 'Chi nhánh cấp nước số 1 Trực Ninh', null),
           ('DEPT-008', 'Chi nhánh cấp nước Vụ Bản', null),
           ('DEPT-009', 'Chi nhánh cấp nước Ý Yên', null),
           ('DEPT-010', 'Chi nhánh cấp nước số 2 Trực Ninh', null),
           ('DEPT-011', 'Phòng Quản lý dự án đầu tư', null),
           ('DEPT-012', 'Phòng Thanh tra xử lý', null),
           ('DEPT-013', 'Chi nhánh chống thất thoát', null);

-- Job (30 records)
    INSERT INTO public.job (job_id, created_at, name, updated_at)
    VALUES ('JOB-001', CURRENT_TIMESTAMP, 'Cấp quản lý xem báo cáo', CURRENT_TIMESTAMP),
           ('JOB-002', CURRENT_TIMESTAMP, 'Chỉnh giá trên dự toán', CURRENT_TIMESTAMP),
           ('JOB-003', CURRENT_TIMESTAMP, 'Chỉnh sửa chỉ số đầu', CURRENT_TIMESTAMP),
           ('JOB-004', CURRENT_TIMESTAMP, 'Đội trưởng thi công', CURRENT_TIMESTAMP),
           ('JOB-005', CURRENT_TIMESTAMP, 'Ghi thu', CURRENT_TIMESTAMP),
           ('JOB-006', CURRENT_TIMESTAMP, 'Giám đốc chi nhánh', CURRENT_TIMESTAMP),
           ('JOB-007', CURRENT_TIMESTAMP, 'In hóa đơn', CURRENT_TIMESTAMP),
           ('JOB-008', CURRENT_TIMESTAMP, 'Nhân viên chống thất thoát', CURRENT_TIMESTAMP),
           ('JOB-009', CURRENT_TIMESTAMP, 'Nhân viên đi ghi', CURRENT_TIMESTAMP),
           ('JOB-010', CURRENT_TIMESTAMP, 'Nhân viên kế hoạch', CURRENT_TIMESTAMP),
           ('JOB-011', CURRENT_TIMESTAMP, 'Kỹ sư Thiết kế Kết cấu', CURRENT_TIMESTAMP),
           ('JOB-012', CURRENT_TIMESTAMP, 'Chuyên viên Đấu thầu', CURRENT_TIMESTAMP),
           ('JOB-013', CURRENT_TIMESTAMP, 'Trưởng phòng Thi công', CURRENT_TIMESTAMP),
           ('JOB-014', CURRENT_TIMESTAMP, 'Đội trưởng Đội sản xuất', CURRENT_TIMESTAMP),
           ('JOB-015', CURRENT_TIMESTAMP, 'Công nhân Kỹ thuật Bậc cao', CURRENT_TIMESTAMP),
           ('JOB-016', CURRENT_TIMESTAMP, 'Trưởng phòng Kinh doanh', CURRENT_TIMESTAMP),
           ('JOB-017', CURRENT_TIMESTAMP, 'Chuyên viên Phát triển Thị trường', CURRENT_TIMESTAMP),
           ('JOB-018', CURRENT_TIMESTAMP, 'Nhân viên Tư vấn Khách hàng', CURRENT_TIMESTAMP),
           ('JOB-019', CURRENT_TIMESTAMP, 'Chuyên viên Marketing Digital', CURRENT_TIMESTAMP),
           ('JOB-020', CURRENT_TIMESTAMP, 'Kế toán trưởng', CURRENT_TIMESTAMP),
           ('JOB-021', CURRENT_TIMESTAMP, 'Kế toán Tổng hợp', CURRENT_TIMESTAMP),
           ('JOB-022', CURRENT_TIMESTAMP, 'Nhân viên Hành chính Nhân sự', CURRENT_TIMESTAMP),
           ('JOB-023', CURRENT_TIMESTAMP, 'Chuyên viên Tuyển dụng', CURRENT_TIMESTAMP),
           ('JOB-024', CURRENT_TIMESTAMP, 'Nhân viên Pháp chế', CURRENT_TIMESTAMP),
           ('JOB-025', CURRENT_TIMESTAMP, 'Quản lý Dự án (PM)', CURRENT_TIMESTAMP),
           ('JOB-026', CURRENT_TIMESTAMP, 'Chuyên viên Quản lý Chất lượng (QA/QC)', CURRENT_TIMESTAMP),
           ('JOB-027', CURRENT_TIMESTAMP, 'Nhân viên Lễ tân', CURRENT_TIMESTAMP),
           ('JOB-028', CURRENT_TIMESTAMP, 'Nhân viên Thủ kho', CURRENT_TIMESTAMP),
           ('JOB-029', CURRENT_TIMESTAMP, 'Tài xế Văn phòng', CURRENT_TIMESTAMP),
           ('JOB-030', CURRENT_TIMESTAMP, 'Nhân viên Bảo vệ', CURRENT_TIMESTAMP);
  END
$$;
