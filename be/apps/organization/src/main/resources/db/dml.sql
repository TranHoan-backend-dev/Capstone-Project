DO
$$
  BEGIN
    -- Business Page (25 records)
    INSERT INTO public.business_page (page_id, activate, creator, name, updator)
    VALUES ('86088520-f274-4ac2-a94b-b761995abf4a', true, 'admin', 'Trang chủ', 'admin'),
           ('4c3cdd22-5018-482c-bc34-51331e7167a9', true, 'admin', 'Lập hợp đồng cấp nước mới', 'admin'),
           ('b4758afc-f456-4538-aabe-3d09a4591f34', true, 'admin', 'Đơn lắp đặt mới', 'admin'),
           ('b13d7531-4935-4da6-972e-04bbda46b47a', true, 'admin', 'Tra cứu đơn lắp đặt mới', 'admin'),
           ('88e1d15b-2407-487f-b4e1-aa96e18f0d85', true, 'admin', 'Tra cứu khách hàng', 'admin'),
           ('ceedf230-1a7a-4c9d-b0c1-ce635d301ff3', true, 'admin', 'Khôi phục khách hàng hủy', 'admin'),
           ('739f3f11-6947-4135-98ed-f3e59e790d1b', true, 'admin', 'Nhập khách hàng mới', 'admin'),
           ('f16aa118-8f06-42c6-93f8-22fd9e06e071', true, 'admin', 'Danh sách đơn chờ dự toán', 'admin'),
           ('7d0d26c3-b236-4109-a7cc-5b36fa65b2dd', true, 'admin', 'Danh sách đơn chờ duyệt dự toán', 'admin'),
           ('c3d78a4c-f262-4d16-bee3-ffe0d7c50e78', true, 'admin', 'Danh sách đơn từ chối duyệt dự toán', 'admin'),
           ('94d31724-2d18-4d93-be2a-6a3336fcf0ce', true, 'admin', 'Danh sách đơn đã phân công khảo sát', 'admin'),
           ('9a8a209a-b8d5-44e1-b7ab-7ed6a5e6e37c', true, 'admin', 'Danh sách khách hàng gọi điện', 'admin'),
           ('59ae463d-90dd-463e-beae-969df2c66272', true, 'admin', 'Xử lý đơn chờ thiết kế & Thiết kế', 'admin'),
           ('b3b1d1ec-9c86-45ff-acb2-31c89b1a748c', true, 'admin', 'Phân công khảo sát thiết kế', 'admin'),
           ('8b209371-21bf-4721-a390-12d1dcfc5d98', true, 'admin', 'Duyệt dự toán', 'admin'),
           ('b81720dd-be50-4b31-8310-9e10f6d98198', true, 'admin', 'Chạy dự toán', 'admin'),
           ('e617e074-18b1-4f20-8c19-beb815db7406', true, 'admin', 'Tra cứu dự toán', 'admin'),
           ('a72a7a72-ef63-4e19-9a1d-294088fd91d1', true, 'admin', 'Quản lý mẫu bốc vật tư', 'admin'),
           ('88384dc8-2150-44f9-9691-202794fb00e2', true, 'admin', 'Tra cứu quyết toán', 'admin'),
           ('e70256d4-0ceb-4fe6-94bb-78fb2261fd88', true, 'admin', 'Kiểm tra chỉ số bằng hình ảnh', 'admin'),
           ('bff81f4f-e6be-4750-8d4c-fb4d21b903ae', true, 'admin', 'Hồ sơ khách hàng', 'admin');

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
