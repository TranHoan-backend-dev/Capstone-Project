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
    VALUES ('29f12d88-7517-482a-9f44-8d9124443183', 'Phòng Kế hoạch Kỹ Thuật', '02283638708'),
           ('85c2c776-6927-4402-8616-562ec874b321', 'Phòng Thi công', null),
           ('d1767664-9f79-4416-952b-7c70ae1c97a5', 'Phòng Kinh doanh', null),
           ('e1823908-0125-468b-9831-5079a4055577', 'Phòng Tài vụ', null),
           ('f3c6507c-38d7-463d-8280-975940c61159', 'Phòng Tin học', '02283636681'),
           ('c1494541-d306-444f-a0e2-763435163353', 'Chi nhánh Kinh doanh NS NĐ', null),
           ('8be4d048-52c6-4d7a-85eb-515456f93796', 'Chi nhánh cấp nước số 1 Trực Ninh', null),
           ('56c9a752-ce67-4648-9f17-5788e0c83a71', 'Chi nhánh cấp nước Vụ Bản', null),
           ('9482d83b-3d60-4963-9d10-388656128038', 'Chi nhánh cấp nước Ý Yên', null),
           ('b7201c13-7521-4d92-9721-e73087282855', 'Chi nhánh cấp nước số 2 Trực Ninh', null),
           ('4a94625d-20d8-4a57-beba-4e9411333e7e', 'Phòng Quản lý dự án đầu tư', null),
           ('10580977-873b-4876-857c-882d4918a56f', 'Phòng Thanh tra xử lý', null),
           ('a8497645-0371-468e-a2f0-e69676e19194', 'Chi nhánh chống thất thoát', null);

-- Job (25 records)
    INSERT INTO public.job (job_id, created_at, name, updated_at)
    VALUES ('2420a323-e180-4927-b956-654761026048', CURRENT_TIMESTAMP, 'Cấp quản lý xem báo cáo', CURRENT_TIMESTAMP),
           ('b450503c-e30d-45be-803e-ac3226756811', CURRENT_TIMESTAMP, 'Chỉnh giá trên dự toán', CURRENT_TIMESTAMP),
           ('8718a38c-a113-4395-97df-036113b246a4', CURRENT_TIMESTAMP, 'Chỉnh sửa chỉ số đầu', CURRENT_TIMESTAMP),
           ('c374665f-4a65-4d08-8e68-8de1b369c762', CURRENT_TIMESTAMP, 'Đội trưởng thi công', CURRENT_TIMESTAMP),
           ('f8b63116-419b-43d9-9596-f9e421e428df', CURRENT_TIMESTAMP, 'Ghi thu', CURRENT_TIMESTAMP),
           ('4b35e298-2a78-4573-8c46-8f8303036006', CURRENT_TIMESTAMP, 'Giám đốc chi nhánh', CURRENT_TIMESTAMP),
           ('a785311e-8d02-4091-af5e-88091152a513', CURRENT_TIMESTAMP, 'In hóa đơn', CURRENT_TIMESTAMP),
           ('0586026a-9366-48c3-982e-9d821215b22b', CURRENT_TIMESTAMP, 'Nhân viên chống thất thoát', CURRENT_TIMESTAMP),
           ('93268800-410a-4876-b333-662369656828', CURRENT_TIMESTAMP, 'Nhân viên đi ghi', CURRENT_TIMESTAMP),
           ('18177579-2475-4702-a164-9685652613b1', CURRENT_TIMESTAMP, 'Nhân viên kế hoạch', CURRENT_TIMESTAMP),
           ('065842c2-8025-4c07-bc7e-976402422731', CURRENT_TIMESTAMP, 'Nhân viên kiểm tra', CURRENT_TIMESTAMP),
           ('d8d21c38-8924-4061-827d-c36399996614', CURRENT_TIMESTAMP, 'Nhân viên kỹ thuật', CURRENT_TIMESTAMP),
           ('56475704-5001-443b-a25e-e47573677461', CURRENT_TIMESTAMP, 'Nhân viên nghiệm thu công trình', CURRENT_TIMESTAMP),
           ('2060377b-665e-49b4-825e-d21820625406', CURRENT_TIMESTAMP, 'Nhân viên sửa chữa', CURRENT_TIMESTAMP),
           ('09492160-c3d3-467a-b924-cc0985550c60', CURRENT_TIMESTAMP, 'Nhân viên thi công', CURRENT_TIMESTAMP),
           ('50212f45-0370-4322-a7d5-d14300329759', CURRENT_TIMESTAMP, 'Nhân viên thu tiền nước', CURRENT_TIMESTAMP),
           ('47585141-9496-4148-8df5-e1150495368a', CURRENT_TIMESTAMP, 'Nhân viên văn phòng', CURRENT_TIMESTAMP),
           ('0a082087-0b13-491b-b72e-848821958210', CURRENT_TIMESTAMP, 'Nhập chỉ số đồng hồ', CURRENT_TIMESTAMP),
           ('0684277b-7b06-4475-8162-817651877607', CURRENT_TIMESTAMP, 'Nhập khách hàng và phân lộ trình', CURRENT_TIMESTAMP),
           ('36526154-1296-4660-8488-842230006322', CURRENT_TIMESTAMP, 'Phó giám đốc chi nhánh', CURRENT_TIMESTAMP),
           ('06085521-1221-4470-8255-888461741517', CURRENT_TIMESTAMP, 'Phó phòng', CURRENT_TIMESTAMP),
           ('96336688-2122-4462-8114-118833989911', CURRENT_TIMESTAMP, 'Quản trị hệ thống', CURRENT_TIMESTAMP),
           ('55266155-5221-4471-8963-229944118822', CURRENT_TIMESTAMP, 'Thay đồng hồ', CURRENT_TIMESTAMP),
           ('44115599-2288-4433-7744-996633221144', CURRENT_TIMESTAMP, 'Thiết kế dự toán', CURRENT_TIMESTAMP),
           ('88552211-1144-4477-8855-663322114477', CURRENT_TIMESTAMP, 'Trưởng phòng', CURRENT_TIMESTAMP);
  END
$$;
