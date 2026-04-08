-- auth
INSERT INTO public.user_roles (role_id, name)
VALUES ('6bb525d0-3911-4851-9b8d-d929a080b609', 'IT_STAFF'),
       ('c4d8f989-0bc5-4c3a-9449-c3db12295a90', 'PLANNING_TECHNICAL_DEPARTMENT_HEAD'),
       ('da4429b4-d7a7-4283-b386-189d69a95af9', 'SURVEY_STAFF'),
       ('a789aaf0-6153-4f30-ac38-b08e859d5fcb', 'ORDER_RECEIVING_STAFF'),
       ('724184e3-456a-4c89-b3c5-b8ab508f80b5', 'FINANCE_DEPARTMENT'),
       ('e9e6f842-9d4d-4a72-ae1b-ed06115a5119', 'CONSTRUCTION_DEPARTMENT_HEAD'),
       ('6844f465-886a-4838-852b-864eb64e7d92', 'CONSTRUCTION_DEPARTMENT_STAFF'),
       ('47c469de-21fd-4a32-a468-01a50f4aced6', 'BUSINESS_DEPARTMENT_HEAD'),
       ('852841cd-8e76-4eea-a7fe-9b15459d5eea', 'METER_INSPECTION_STAFF'),
       ('8ec56833-edd5-4a52-9fc8-256b91e2daca', 'COMPANY_LEADERSHIP');

INSERT INTO public.users (user_id, username, created_at, department_id, electronic_signing_url, email, is_enabled,
                          is_locked,
                          locked_at, locked_reason, updated_at, water_supply_network_id, role_id)
VALUES ('d75e221e-d150-4962-9afb-687062bfbcc8', 'survey_staff1', '2026-03-25 08:45:08.304775',
        '29f12d88-7517-482a-9f44-8d9124443183', 'argear', 'hoana6k44nknd@gmail.com', true, false, null, null,
        '2026-03-25 08:45:08.304775', '550e8400-e29b-41d4-a716-446655440001', 'da4429b4-d7a7-4283-b386-189d69a95af9'),
       ('6e9f757b-6fa1-4aa6-b7cb-a4cf2290eb20', 'test', '2025-09-14 00:00:00.000000',
        'f3c6507c-38d7-463d-8280-975940c61159', 'efsdf', 'ndd1032003@gmail.com', true, false, null, null,
        '2026-03-25 08:45:08.304775', '550e8400-e29b-41d4-a716-446655440001', '6bb525d0-3911-4851-9b8d-d929a080b609'),
       ('14c5879c-a6c4-45a6-846b-39d2b9d8c961', 'pt_head', '2024-03-24 00:00:00.000000',
        '29f12d88-7517-482a-9f44-8d9124443183', 'argear', 'a@gmail.com', true, false, '2026-03-25 08:45:08.304775',
        'eh', '2025-03-12 00:00:00.000000', '550e8400-e29b-41d4-a716-446655440001',
        'c4d8f989-0bc5-4c3a-9449-c3db12295a90'),
       ('c41aff7a-36dc-4910-8336-83f32e6c7c0e', 'cd_head', '2026-03-31 21:40:52.904827',
        '85c2c776-6927-4402-8616-562ec874b321', 'argear', 'b@gmail.com', true, false, null, null,
        '2026-03-31 21:40:52.904827', '550e8400-e29b-41d4-a716-446655440001', 'e9e6f842-9d4d-4a72-ae1b-ed06115a5119'),
       ('2195306e-5a37-4bab-b8b1-d47f1aed4540', 'cd_staff', '2026-03-31 21:46:03.713722',
        '85c2c776-6927-4402-8616-562ec874b321', 'argear', 'd@gmail.com', true, false, null, null,
        '2026-03-31 21:46:03.713722', '550e8400-e29b-41d4-a716-446655440001', '6844f465-886a-4838-852b-864eb64e7d92'),
       ('f20a1a65-e94a-4030-9f17-e97c269dbfec', 'finance', '2026-03-31 22:07:00.825828',
        'e1823908-0125-468b-9831-5079a4055577', 'argear', 'e@gmail.com', true, false, null, null,
        '2026-03-31 22:07:00.825828', '550e8400-e29b-41d4-a716-446655440001', '724184e3-456a-4c89-b3c5-b8ab508f80b5'),
       ('121073a4-998e-4a2b-8a3b-40c07eb94757', 'order_staff', '2026-03-31 22:07:00.825828',
        '29f12d88-7517-482a-9f44-8d9124443183', 'argear', 'c@gmail.com', true, false, null, null,
        '2026-03-31 22:07:00.825828', '550e8400-e29b-41d4-a716-446655440001', 'a789aaf0-6153-4f30-ac38-b08e859d5fcb'),
       ('dec41927-c92d-4bc0-9530-64575e07ec41', 'president_01', '2026-03-31 22:07:00.825828',
        '307791fc-d4b8-4325-bbfb-776ff3605179', 'argear', 'f@gmail.com', true, false, null, null,
        '2026-03-31 22:07:00.825828', '550e8400-e29b-41d4-a716-446655440001', '8ec56833-edd5-4a52-9fc8-256b91e2daca'),
       ('e2c01282-88f9-4173-8b42-825ac9f8531a', 'meter_staff', '2026-03-31 22:29:57.883438',
        'd1767664-9f79-4416-952b-7c78ae1c97a5', 'argear', 'i@gmail.com', true, false, null, null,
        '2026-03-31 22:29:57.883438', '550e8400-e29b-41d4-a716-446655440001', '852841cd-8e76-4eea-a7fe-9b15459d5eea'),
       ('ca8ca261-36ad-4660-b58d-1a950ec861cb', 'b_head', '2026-03-31 22:29:57.883438',
        'd1767664-9f79-4416-952b-7c78ae1c97a5', 'argear', 'h@gmail.com', true, false, null, null,
        '2026-03-31 22:29:57.883438', '550e8400-e29b-41d4-a716-446655440001', '47c469de-21fd-4a32-a468-01a50f4aced6'),
       ('de8bf961-aed1-4b86-898f-32a96e84f8ea', 'president_construction', '2026-03-31 22:29:57.883438',
        '307791fc-d4b8-4325-bbfb-776ff3605179', 'argear', 'g@gmail.com', true, false, null, null,
        '2026-03-31 22:29:57.883438', '550e8400-e29b-41d4-a716-446655440001', '8ec56833-edd5-4a52-9fc8-256b91e2daca'),
       ('f018b804-12fc-41ec-87c1-08b6aa6f542d', 'survey_staff2', '2026-03-31 22:34:53.769677',
        '29f12d88-7517-482a-9f44-8d9124443183', 'argear', 'j@gmail.com', true, false, null, null,
        '2026-03-31 22:34:53.769677', '550e8400-e29b-41d4-a716-446655440001', 'da4429b4-d7a7-4283-b386-189d69a95af9'),
       ('91e138a1-824f-4db7-a073-e35fc24ec96f', 'survey_staff3', '2026-03-31 22:36:35.719576',
        '29f12d88-7517-482a-9f44-8d9124443183', 'argear', 'k@gmail.com', true, false, null, null,
        '2026-03-31 22:36:35.719576', '550e8400-e29b-41d4-a716-446655440001', 'da4429b4-d7a7-4283-b386-189d69a95af9');

INSERT INTO public.profile (user_id, address, avatar_url, birthday, gender, phone_number)
VALUES ('d75e221e-d150-4962-9afb-687062bfbcc8', null, null, null, true, '0949279200'),
       ('6e9f757b-6fa1-4aa6-b7cb-a4cf2290eb20', null, null, null, false, '0949279210'),
       ('14c5879c-a6c4-45a6-846b-39d2b9d8c961', 'HCM', null, '1990-04-04', false, '0900000004'),
       ('c41aff7a-36dc-4910-8336-83f32e6c7c0e', 'DN', null, '1990-05-05', true, '0900000005'),
       ('2195306e-5a37-4bab-b8b1-d47f1aed4540', 'DN', null, '1990-06-06', false, '0900000006'),
       ('f20a1a65-e94a-4030-9f17-e97c269dbfec', 'CT', null, '1990-07-07', true, '0900000007'),
       ('121073a4-998e-4a2b-8a3b-40c07eb94757', 'CT', null, '1990-08-08', false, '0900000008'),
       ('dec41927-c92d-4bc0-9530-64575e07ec41', 'HP', null, '1990-09-09', true, '0900000009'),
       ('e2c01282-88f9-4173-8b42-825ac9f8531a', 'HP', null, '1990-10-10', false, '0900000010'),
       ('ca8ca261-36ad-4660-b58d-1a950ec861cb', null, null, '1990-10-10', false, '0900000011'),
       ('de8bf961-aed1-4b86-898f-32a96e84f8ea', null, null, '1990-10-10', false, '0900000012'),
       ('f018b804-12fc-41ec-87c1-08b6aa6f542d', null, null, '1990-10-10', false, '0900000013'),
       ('91e138a1-824f-4db7-a073-e35fc24ec96f', null, null, '1990-10-10', false, '0900000014');

-- survey_staff1
INSERT INTO public.business_pages_of_employees (page_id, users_user_id)
VALUES ('86088520-f274-4ac2-a94b-b761995abf4a', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('88e1d15b-2407-487f-b4e1-aa96e18f0d85', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('b13d7531-4935-4da6-972e-04bbda46b47a', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('59ae463d-90dd-463e-beae-969df2c66272', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('b81720dd-be50-4b31-8310-9e10f6d98198', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('e617e074-18b1-4f20-8c19-beb815db7406', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('a72a7a72-ef63-4e19-9a1d-294088fd91d1', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('e70256d4-0ceb-4fe6-94bb-78fb2261fd88', 'd75e221e-d150-4962-9afb-687062bfbcc8'),
       ('bff81f4f-e6be-4750-8d4c-fb4d21b903ae', 'd75e221e-d150-4962-9afb-687062bfbcc8');
-- survery_staff2
INSERT INTO public.business_pages_of_employees (page_id, users_user_id)
VALUES ('86088520-f274-4ac2-a94b-b761995abf4a', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('88e1d15b-2407-487f-b4e1-aa96e18f0d85', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('b13d7531-4935-4da6-972e-04bbda46b47a', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('59ae463d-90dd-463e-beae-969df2c66272', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('b81720dd-be50-4b31-8310-9e10f6d98198', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('e617e074-18b1-4f20-8c19-beb815db7406', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('a72a7a72-ef63-4e19-9a1d-294088fd91d1', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('e70256d4-0ceb-4fe6-94bb-78fb2261fd88', 'f018b804-12fc-41ec-87c1-08b6aa6f542d'),
       ('bff81f4f-e6be-4750-8d4c-fb4d21b903ae', 'f018b804-12fc-41ec-87c1-08b6aa6f542d');
-- survery_staff3
INSERT INTO public.business_pages_of_employees (page_id, users_user_id)
VALUES ('86088520-f274-4ac2-a94b-b761995abf4a', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('88e1d15b-2407-487f-b4e1-aa96e18f0d85', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('b13d7531-4935-4da6-972e-04bbda46b47a', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('59ae463d-90dd-463e-beae-969df2c66272', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('b81720dd-be50-4b31-8310-9e10f6d98198', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('e617e074-18b1-4f20-8c19-beb815db7406', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('a72a7a72-ef63-4e19-9a1d-294088fd91d1', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('e70256d4-0ceb-4fe6-94bb-78fb2261fd88', '91e138a1-824f-4db7-a073-e35fc24ec96f'),
       ('bff81f4f-e6be-4750-8d4c-fb4d21b903ae', '91e138a1-824f-4db7-a073-e35fc24ec96f');
-- pt_head
INSERT INTO public.business_pages_of_employees (page_id, users_user_id)
VALUES ('86088520-f274-4ac2-a94b-b761995abf4a', '14c5879c-a6c4-45a6-846b-39d2b9d8c961'),
       ('b13d7531-4935-4da6-972e-04bbda46b47a', '14c5879c-a6c4-45a6-846b-39d2b9d8c961'),
       ('b3b1d1ec-9c86-45ff-acb2-31c89b1a748c', '14c5879c-a6c4-45a6-846b-39d2b9d8c961'),
       ('f16aa118-8f06-42c6-93f8-22fd9e06e071', '14c5879c-a6c4-45a6-846b-39d2b9d8c961'),
       ('c3d78a4c-f262-4d16-bee3-ffe0d7c50e78', '14c5879c-a6c4-45a6-846b-39d2b9d8c961'),
       ('94d31724-2d18-4d93-be2a-6a3336fcf0ce', '14c5879c-a6c4-45a6-846b-39d2b9d8c961'),
       ('e617e074-18b1-4f20-8c19-beb815db7406', '14c5879c-a6c4-45a6-846b-39d2b9d8c961'),
       ('bff81f4f-e6be-4750-8d4c-fb4d21b903ae', '14c5879c-a6c4-45a6-846b-39d2b9d8c961');

-- construction
INSERT INTO water_supply_network (branch_id, created_at, name, updated_at)
VALUES ('550e8400-e29b-41d4-a716-446655440001', '2024-01-01 00:00:00', 'Thành phố Nam Định', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440002', '2024-01-01 00:00:00', 'Nhà máy nước Tân Hiệp', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440003', '2024-01-01 00:00:00', 'Nhà máy nước BOO Thủ Đức',
        '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440004', '2024-01-01 00:00:00', 'Nhà máy nước Kênh Đông', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440005', '2024-01-01 00:00:00', 'Nhà máy nước Bình An', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440006', '2024-01-01 00:00:00', 'Nhà máy nước Tân Phú', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440007', '2024-01-01 00:00:00', 'Nhà máy nước Ngầm', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440008', '2024-01-01 00:00:00', 'Trạm bơm tăng áp số 1', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440009', '2024-01-01 00:00:00', 'Trạm bơm tăng áp số 2', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440010', '2024-01-01 00:00:00', 'Trạm cấp nước Bình Chánh',
        '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440011', '2024-01-01 00:00:00', 'Trạm cấp nước Nhà Bè', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440012', '2024-01-01 00:00:00', 'Trạm cấp nước Cần Giờ', '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440013', '2024-01-01 00:00:00', 'Mạng lưới cấp nước Khu Công Nghệ Cao',
        '2024-01-01 00:00:00'),
       ('550e8400-e29b-41d4-a716-446655440014', '2024-01-01 00:00:00', 'Mạng lưới cấp nước Khu Đô Thị Mới Thủ Thiêm',
        '2024-01-01 00:00:00');

INSERT INTO commune (commune_id, created_at, name, type, updated_at)
VALUES ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0001', now(), 'Thị trấn Nam Giang', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0002', now(), 'Xã Bình Minh', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0003', now(), 'Xã Nam Điền', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0004', now(), 'Xã Đồng Sơn', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0005', now(), 'Xã Hồng Quang', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0006', now(), 'Xã Nam Cường', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0007', now(), 'Xã Nam Dương', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008', now(), 'Xã Nam Ninh', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0009', now(), 'Xã Nam Hoa', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0010', now(), 'Xã Nam Hồng', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0011', now(), 'Xã Nam Hùng', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0012', now(), 'Xã Nam Lợi', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0013', now(), 'Xã Nam Mỹ', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0014', now(), 'Xã Nam Thắng', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0015', now(), 'Xã Nam Thái', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0016', now(), 'Xã Nam Thanh', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0017', now(), 'Xã Nam Tiến', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0018', now(), 'Xã Nam Toàn', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0019', now(), 'Xã Nghĩa An', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0020', now(), 'Xã Tân Thịnh', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0021', now(), 'Xã Cát Thành', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0022', now(), 'Xã Mỹ Hưng', 'RURAL_COMMUNE', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0023', now(), 'Phường Vị Xuyên', 'URBAN_WARD', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0024', now(), 'Phường Trần Tế Xương', 'URBAN_WARD', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0025', now(), 'Phường Cửa Bắc', 'URBAN_WARD', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0026', now(), 'Phường Cửa Nam', 'URBAN_WARD', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0027', now(), 'Phường Vị Hoàng', 'URBAN_WARD', now()),
       ('0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0028', now(), 'Phường Trần Hưng Đạo', 'URBAN_WARD', now());

INSERT INTO hamlet (hamlet_id, created_at, name, type, updated_at, commune_id)
VALUES ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0001', now(), 'Thôn Bốn', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0002', now(), 'Thôn Cau', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0003', now(), 'Thôn Cầu Ghềnh', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0004', now(), 'Thôn Cầu Thiệu', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0005', now(), 'Thôn Cổ Trang', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0006', now(), 'Thôn Đông Bình', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0007', now(), 'Thôn Hải An', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0008', now(), 'Thôn Mỹ', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0009', now(), 'Thôn Nam Hạ', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0010', now(), 'Thôn Nam Thượng', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0011', now(), 'Thôn Thiệu Dương', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0012', now(), 'Thôn Thượng', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0013', now(), 'Thôn Trà', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0014', now(), 'Thôn Trang Hậu', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0015', now(), 'Thôn Trực Hưng', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0016', now(), 'Thôn Xối Tây', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0016'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0017', now(), 'Thôn Nội', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0016'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0018', now(), 'Thôn Phú An', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0021'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0019', now(), 'Thôn Bắc Sơn', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0021'),
       ('1a2b3c4d-0001-4a4a-9b9b-aaaaaaaa0020', now(), 'Thôn Bắc Phong', 'HAMLET', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0021');

INSERT INTO neighborhood_unit (unit_id, created_at, name, updated_at, commune_id)
VALUES ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0001', now(), 'Xóm 4 (Xã Mỹ Hưng)', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0028'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0002', now(), 'Xóm 1', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0003', now(), 'Xóm 2', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0004', now(), 'Xóm 3', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0005', now(), 'Xóm 4 (Xã Nam Ninh)', now(),
        '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0006', now(), 'Xóm 5', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0007', now(), 'Xóm 6', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0008', now(), 'Xóm 7', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0009', now(), 'Xóm 8', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0010', now(), 'Xóm 9', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0011', now(), 'Xóm 10', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0012', now(), 'Xóm 11', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0013', now(), 'Xóm 12', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0014', now(), 'Xóm 13', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0015', now(), 'Xóm 14', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0016', now(), 'Xóm 15', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0017', now(), 'Xóm 16', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0018', now(), 'Xóm 17', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0019', now(), 'Xóm 18', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0020', now(), 'Xóm 19', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008'),
       ('2b3c4d5e-1000-4bbb-9ccc-bbbbbbbb0021', now(), 'Xóm 20', now(), '0f1c0a3a-3c3c-4f33-8c24-7a7c0d6a0008');

INSERT INTO road (road_id, created_at, name, updated_at)
VALUES ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0001', now(), 'KĐT Hòa Vượng', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0002', now(), 'KĐT Mỹ Trung', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0003', now(), 'KĐT Thống Nhất', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0004', now(), 'Đường 38A', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0005', now(), 'Bắc Mỹ Tân', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0006', now(), 'Đường 10', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0007', now(), 'Đệ tứ', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0008', now(), 'Nam Mỹ Tân', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0009', now(), 'Quốc lộ 10', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0010', now(), 'Đường Trần Thừa', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0011', now(), 'Trần Thái Tông', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0012', now(), 'Hoàng Văn Thái', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0013', now(), 'Nguyễn Hữu Huân', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0014', now(), 'Đường Nam Ninh Hải', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0015', now(), 'Đường 21', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0016', now(), 'Đường 21B', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0017', now(), 'Đường 488B', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0018', now(), 'Đường 53B', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0019', now(), 'Cầu Điện Biên', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0020', now(), 'Chợ Mới', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0021', now(), 'Chợ Cũ Ngõ I+II', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccc4ccc0022', now(), 'Cầu Trạm Xá', now());

INSERT INTO laterals (lateral_id, created_at, name, updated_at, water_supply_network_id)
VALUES ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0001', now(), 'A300', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0002', now(), 'B600m', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0003', now(), 'A600c', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0004', now(), 'C400', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0005', now(), 'Năng Tĩnh', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0006', now(), 'Cửa Bắc', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0007', now(), 'Bà Triệu', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0008', now(), 'Lộc Vượng', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0009', now(), 'Hạ Long', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0010', now(), 'Mỹ Tân', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0011', now(), 'Cấp nước Nam Định', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0012', now(), 'Lộc Hạ', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0013', now(), 'Lộc Hòa', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0014', now(), 'Mỹ Xá', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0015', now(), 'Thống Nhất', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0016', now(), 'Trần Tế Xương', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0017', now(), 'DHT Trực Ninh', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0018', now(), 'CQ Trực Ninh 1', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0019', now(), 'Cụm CN', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0020', now(), 'Xã Ninh Giang', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddd4ddd0021', now(), 'Xã Cổ Lễ', now(), NULL);

INSERT INTO roadmap (roadmap_id, created_at, name, updated_at, lateral_id, water_supply_network_id)
VALUES ('5e6f7081-4000-4eee-9fff-eeee4eee0001', now(), '108-111-112e', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0002', now(), '108-111-112f', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0003', now(), '108-111-112g', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0004', now(), '06Va', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0005', now(), '06Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0006', now(), '29Va', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0007', now(), '29Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0008', now(), '29Vc', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0009', now(), '31Va', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0010', now(), '31Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0011', now(), '31Vc', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0012', now(), '08Va', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0013', now(), '08Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0014', now(), '134a', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0015', now(), '134b', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0016', now(), '179a', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0017', now(), '179b', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0018', now(), '188a', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0019', now(), '188b', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeee4eee0020', now(), '197-198', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0021', now(), '172a', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('RM_001', now(), 'Lộ trình Test 001', now(), '4d5e6f70-3000-4ddd-9eee-dddd4ddd0001',
        '550e8400-e29b-41d4-a716-446655440001');

INSERT INTO installation_form (form_code, address, bank_account_number, bank_account_provider_location,
                               citizen_identification_number, citizen_identification_provide_date,
                               citizen_identification_provide_location, created_at, created_by, customer_name,
                               form_number, household_registration_number, number_of_household, overall_water_meter_id,
                               phone_number, received_form_at, updated_at, usage_target, customer_type, handover_by,
                               representative, schedule_survey_at, status, tax_code, water_supply_network_id)
VALUES (80000001001, '123 Lê Lợi, Quận 1, TP.HCM', '190312345678', 'Techcombank TP.HCM',
        '079090000001', '2020-01-01', 'CA TPHCM', '2024-01-01 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Nguyễn Văn A', 20240001, 123456, 4, 'METER-001', '0901234567', '2024-01-01 09:00:00',
        '2024-01-01 10:00:00', 'DOMESTIC', 'COMPANY', NULL, NULL, NULL, '{
    "contract": "PROCESSING",
    "estimate": "PROCESSING",
    "construction": "PROCESSING",
    "registration": "PROCESSING"
  }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001002, '456 Nguyễn Huệ, Quận 1, TP.HCM', '190312345679', 'Vietcombank TP.HCM',
        '079090000002', '2020-01-02', 'CA TPHCM', '2024-01-02 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Trần Thị B', 20240002, 223456, 3, 'METER-002', '0901234568', '2024-01-02 09:00:00',
        '2024-01-02 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001003, '789 Hai Bà Trưng, Quận 3, TP.HCM', '190312345680', 'ACB TP.HCM',
        '079090000003', '2020-01-03', 'CA TPHCM', '2024-01-03 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Lê Văn C', 20240003, 323456, 5, 'METER-003', '0901234569', '2024-01-03 09:00:00',
        '2024-01-03 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001004, '101 Điện Biên Phủ, Bình Thạnh, TP.HCM', '190312345681', 'BIDV TP.HCM',
        '079090000004', '2020-01-04', 'CA TPHCM', '2024-01-04 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Phạm Thị D', 20240004, 423456, 2, 'METER-004', '0901234570', '2024-01-04 09:00:00',
        '2024-01-04 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001005, '202 Nguyễn Thị Minh Khai, Quận 1, TP.HCM', '190312345682', 'VPBank TP.HCM',
        '079090000005', '2020-01-05', 'CA TPHCM', '2024-01-05 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Hoàng Thị E', 20240005, 523456, 3, 'METER-005', '0901234571', '2024-01-05 09:00:00',
        '2024-01-05 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001006, '303 Cách Mạng Tháng Tám, Quận 10, TP.HCM', '190312345683', 'MBBank TP.HCM',
        '079090000006', '2020-01-06', 'CA TPHCM', '2024-01-06 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Nguyễn Văn F', 20240006, 623456, 4, 'METER-006', '0901234572', '2024-01-06 09:00:00',
        '2024-01-06 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001007, '404 Lê Đức Thọ, Gò Vấp, TP.HCM', '190312345684', 'TPBank TP.HCM',
        '079090000007', '2020-01-07', 'CA TPHCM', '2024-01-07 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Trần Thị G', 20240007, 723456, 1, 'METER-007', '0901234573', '2024-01-07 09:00:00',
        '2024-01-07 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001008, '505 Hoàng Văn Thụ, Tân Bình, TP.HCM', '190312345685', 'VIB TP.HCM',
        '079090000008', '2020-01-08', 'CA TPHCM', '2024-01-08 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Lê Văn H', 20240008, 823456, 5, 'METER-008', '0901234574', '2024-01-08 09:00:00',
        '2024-01-08 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001009, '606 Âu Cơ, Tân Bình, TP.HCM', '190312345686', 'SHB TP.HCM',
        '079090000009', '2020-01-09', 'CA TPHCM', '2024-01-09 10:00:00', 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Phạm Thị I', 20240009, 923456, 2, 'METER-009', '0901234575', '2024-01-09 09:00:00',
        '2024-01-09 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       -- survey_staff2
       (80000001010, '707 Trường Chinh, Tân Bình, TP.HCM', '190312345687', 'HDBank TP.HCM',
        '079090000010', '2020-01-10', 'CA TPHCM', '2024-01-10 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Nguyễn Văn J', 20240010, 1023456, 3, 'METER-010', '0901234576', '2024-01-10 09:00:00',
        '2024-01-10 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001011, '808 Cộng Hòa, Tân Bình, TP.HCM', '190312345688', 'Eximbank TP.HCM',
        '079090000011', '2020-01-11', 'CA TPHCM', '2024-01-11 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Nguyễn Văn K', 20240011, 1123456, 4, 'METER-011', '0901234577', '2024-01-11 09:00:00',
        '2024-01-11 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001012, '909 Phan Văn Trị, Gò Vấp, TP.HCM', '190312345689', 'Maritime Bank TP.HCM',
        '079090000012', '2020-01-12', 'CA TPHCM', '2024-01-12 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Trần Thị L', 20240012, 1223456, 2, 'METER-012', '0901234578', '2024-01-12 09:00:00',
        '2024-01-12 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001013, '111 Lê Lai, Quận 1, TP.HCM', '190312345690', 'LienVietPostBank TP.HCM',
        '079090000013', '2020-01-13', 'CA TPHCM', '2024-01-13 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Lê Văn M', 20240013, 1323456, 3, 'METER-013', '0901234579', '2024-01-13 09:00:00',
        '2024-01-13 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001014, '222 Lê Thánh Tôn, Quận 1, TP.HCM', '190312345691', 'SeaBank TP.HCM',
        '079090000014', '2020-01-14', 'CA TPHCM', '2024-01-14 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Phạm Thị N', 20240014, 1423456, 4, 'METER-014', '0901234580', '2024-01-14 09:00:00',
        '2024-01-14 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001015, '333 Lí Tự Trọng, Quận 1, TP.HCM', '190312345692', 'OCB TP.HCM',
        '079090000015', '2020-01-15', 'CA TPHCM', '2024-01-15 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Hoàng Thị O', 20240015, 1523456, 1, 'METER-015', '0901234581', '2024-01-15 09:00:00',
        '2024-01-15 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001016, '123 Trần Hưng Đạo, Nam Định', '190312345693', 'Techcombank Nam Định',
        '079090000016', '2020-02-01', 'CA Nam Định', '2024-03-25 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Nguyễn Văn Nam', 20240016, 654321, 4, 'METER-016', '0901234582', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PENDING_FOR_APPROVAL"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001017, '456 Lê Hồng Phong, Nam Định', '190312345694', 'Vietcombank Nam Định',
        '079090000017', '2020-02-02', 'CA Nam Định', '2024-03-25 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Trần Thị Lan', 20240017, 754321, 3, 'METER-017', '0901234583', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PENDING_FOR_APPROVAL",
         "construction": "PROCESSING",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001018, '789 Quang Trung, Nam Định', '190312345695', 'ACB Nam Định',
        '079090000018', '2020-02-03', 'CA Nam Định', '2024-03-25 10:00:00', 'f018b804-12fc-41ec-87c1-08b6aa6f542d',
        'Lê Văn Bình', 20240018, 854321, 5, 'METER-018', '0901234584', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       -- survey_staff3
       (80000001019, '101 Nguyễn Du, Nam Định', '190312345696', 'BIDV Nam Định',
        '079090000019', '2020-02-04', 'CA Nam Định', '2024-03-25 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Phạm Thị Mai', 20240019, 954321, 2, 'METER-019', '0901234585', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "APPROVED",
         "construction": "PROCESSING",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001020, '202 Hùng Vương, Nam Định', '190312345697', 'VPBank Nam Định',
        '079090000020', '2020-02-05', 'CA Nam Định', '2024-03-25 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Hoàng Văn Dũng', 20240020, 1054321, 3, 'METER-020', '0901234586', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "PROCESSING",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001021, '303 Trường Chinh, Nam Định', '190312345698', 'MB Nam Định',
        '079090000021', '2020-02-06', 'CA Nam Định', '2024-03-25 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Nguyễn Thị Hoa', 20240021, 1154321, 4, 'METER-021', '0901234587', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "PENDING_FOR_APPROVAL",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001022, '404 Võ Nguyên Giáp, Nam Định', '190312345699', 'Sacombank Nam Định',
        '079090000022', '2020-02-07', 'CA Nam Định', '2024-03-25 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Trần Văn Thành', 20240022, 1254321, 2, 'METER-022', '0901234588', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001023, '505 Điện Biên, Nam Định', '190312345700', 'Techcombank Nam Định',
        '079090000023', '2020-02-08', 'CA Nam Định', '2024-03-25 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Phạm Thị Hồng', 20240023, 1354321, 5, 'METER-023', '0901234589', '2024-03-25 09:00:00',
        '2024-03-25 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "REJECTED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001024, '606 Giải Phóng, Nam Định', '190312345701', 'Techcombank Nam Định',
        '079090000024', '2020-03-01', 'CA Nam Định', '2024-03-26 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Bùi Văn Cường', 20240024, 654322, 4, 'METER-024', '0901234590', '2024-03-26 09:00:00',
        '2024-03-26 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "REJECTED",
         "construction": "PROCESSING",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001025, '707 Trường Chinh, Nam Định', '190312345702', 'Vietcombank Nam Định',
        '079090000025', '2020-03-02', 'CA Nam Định', '2024-03-26 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Đặng Thị B', 20240025, 754322, 3, 'METER-025', '0901234591', '2024-03-26 09:00:00',
        '2024-03-26 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "PENDING_FOR_APPROVAL",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001026, '808 Hoàng Hoa Thám, Nam Định', '190312345703', 'ACB Nam Định',
        '079090000026', '2020-03-03', 'CA Nam Định', '2024-03-26 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Vũ Văn T', 20240026, 854322, 5, 'METER-026', '0901234592', '2024-03-26 09:00:00',
        '2024-03-26 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PENDING_FOR_APPROVAL"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001027, '909 Mạc Thị Bưởi, Nam Định', '190312345704', 'BIDV Nam Định',
        '079090000027', '2020-03-04', 'CA Nam Định', '2024-03-26 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Nguyễn Thị Q', 20240027, 954322, 2, 'METER-027', '0901234593', '2024-03-26 09:00:00',
        '2024-03-26 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PENDING_FOR_APPROVAL",
         "construction": "PROCESSING",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001028, '1010 Hàng Thao, Nam Định', '190312345705', 'VPBank Nam Định',
        '079090000028', '2020-03-05', 'CA Nam Định', '2024-03-26 10:00:00', '91e138a1-824f-4db7-a073-e35fc24ec96f',
        'Trần Văn K', 20240028, 1054322, 3, 'METER-028', '0901234594', '2024-03-26 09:00:00',
        '2024-03-26 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001029, '11 Nguyễn Du, Nam Định', '190312345706', 'Agribank Nam Định',
        '079090000029', '2020-04-01', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Nguyễn Thị Tới', 20240029, 101, 4, 'METER-029', '0901234601', '2024-04-01',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001030, '22 Trần Phú, Nam Định', '190312345707', 'BIDV Nam Định',
        '079090000030', '2020-04-02', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Lê Văn Thắng', 20240030, 102, 3, 'METER-030', '0901234602', '2024-04-01',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001031, '33 Lý Thường Kiệt, Nam Định', '190312345708', 'Vietcombank Nam Định',
        '079090000031', '2020-04-03', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Trần Thị Tuyết', 20240031, 103, 5, 'METER-031', '0901234603', '2024-04-01',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001032, '44 Hàng Thao, Nam Định', '190312345709', 'Techcombank Nam Định',
        '079090000032', '2020-04-04', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Phạm Văn Hùng', 20240032, 104, 2, 'METER-032', '0901234604', '2024-04-01',
        now(), 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001033, '55 Quang Trung, Nam Định', '190312345710', 'VPBank Nam Định',
        '079090000033', '2020-04-05', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Hoàng Thị Kim', 20240033, 105, 4, 'METER-033', '0901234605', '2024-04-02',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001034, '66 Lê Hồng Phong, Nam Định', '190312345711', 'ACB Nam Định',
        '079090000034', '2020-04-06', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Đỗ Văn Cường', 20240034, 106, 3, 'METER-034', '0901234606', '2024-04-02',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001035, '77 Hùng Vương, Nam Định', '190312345712', 'Sacombank Nam Định',
        '079090000035', '2020-04-07', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Bùi Thị Ngọc', 20240035, 107, 5, 'METER-035', '0901234607', '2024-04-02',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440001'),
       (80000001036, '88 Võ Nguyên Giáp, Nam Định', '190312345713', 'Maritime Bank',
        '079090000036', '2020-05-01', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Võ Văn Thành', 20240036, 108, 2, 'METER-036', '0901234608', '2024-05-01',
        now(), 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440002'),
       (80000001037, '99 Trường Chinh, Nam Định', '190312345714', 'SeABank',
        '079090000037', '2020-05-02', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Đặng Thị Hồng', 20240037, 109, 4, 'METER-037', '0901234609', '2024-05-01',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440002'),
       (80000001038, '111 Điện Biên, Nam Định', '190312345715', 'TPBank',
        '079090000038', '2020-05-03', 'CA Nam Định', now(), 'd75e221e-d150-4962-9afb-687062bfbcc8',
        'Phan Văn Minh', 20240038, 110, 3, 'METER-038', '0901234610', '2024-05-01',
        now(), 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "APPROVED",
         "estimate": "APPROVED",
         "construction": "APPROVED",
         "registration": "APPROVED"
       }', NULL, '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO cost_estimate (estimation_id, address, construction_machinery_coefficient,
                           contract_fee, create_by, created_at, customer_name,
                           design_coefficient, design_fee, design_image_url,
                           general_cost_coefficient, installation_fee,
                           labor_coefficient, note, overall_water_meter_id,
                           precalculated_tax_coefficient, registration_at,
                           survey_effort, survey_fee, updated_at, vat_coefficient, water_meter_serial,
                           installation_form_form_code, installation_form_form_number, significance)
VALUES ('7a8192a3-6000-4bbb-9ccc-gggggggg0001', '456 Lê Hồng Phong, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Trần Thị Lan', 1, 200000,
        'https://example.com/design1.png', 1, 300000, 1, 'Kế hoạch lắp đặt khu vực ngõ', 'METER-017', 1, '2024-03-25',
        1, 150000, now(), 1, 'SN-2024-017',
        80000001017, 20240017, '{
    "surveyStaff": "Nguyễn Văn Khảo Sát",
    "companyLeaderShip": "Lê Văn Quản Lý",
    "planningTechnicalHead": "Trần Trưởng Phòng"
  }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0002', '789 Quang Trung, Nam Định', 1, 1200000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Lê Văn Bình', 1, 250000,
        'https://example.com/design2.png', 1, 350000, 1, 'Nhà mặt phố, cần khoan hạ tầng', 'METER-018', 1, '2024-03-25',
        1, 180000, now(), 1, 'SN-2024-018',
        80000001018, 20240018, '{
         "surveyStaff": "Phạm Văn Điều Tra",
         "companyLeaderShip": "Hoàng Văn Giám Đốc",
         "planningTechnicalHead": "Vũ Kỹ Thuật"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0003', '101 Nguyễn Du, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Phạm Thị Mai', 1, 200000,
        'https://example.com/design3.png', 1, 300000, 1, 'Lắp đặt mới hoàn toàn', 'METER-019', 1, '2024-03-25', 1,
        150000, now(), 1, 'SN-2024-019',
        80000001019, 20240019, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0004', '202 Hùng Vương, Nam Định', 1, 1500000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Hoàng Văn Dũng', 1, 300000,
        'https://example.com/design20.png', 1, 400000, 1, 'Thi công khu dân cư mới', 'METER-020', 1, '2024-03-25', 1,
        200000, now(), 1, 'SN-2024-020',
        80000001020, 20240020, '{
         "surveyStaff": "Trần Văn Kiểm Tra",
         "companyLeaderShip": "Lê Quản Lý",
         "planningTechnicalHead": "Nguyễn Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0005', '303 Trường Chinh, Nam Định', 1, 1100000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Nguyễn Thị Hoa', 1, 220000,
        'https://example.com/design21.png', 1, 320000, 1, 'Nâng cấp hệ thống hiện có', 'METER-021', 1, '2024-03-25', 1,
        160000, now(), 1, 'SN-2024-021',
        80000001021, 20240021, '{
         "surveyStaff": "Lê Văn Thẩm Định",
         "companyLeaderShip": "Trần Ban Giám Đốc",
         "planningTechnicalHead": "Hoàng Kỹ Thuật"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0006', '404 Võ Nguyên Giáp, Nam Định', 1, 1400000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Trần Văn Thành', 1, 280000,
        'https://example.com/design22.png', 1, 380000, 1, 'Lắp đặt tại cơ sở kinh doanh', 'METER-022', 1, '2024-03-25',
        1, 190000, now(), 1, 'SN-2024-022',
        80000001022, 20240022, '{
         "surveyStaff": "Phạm Văn Đo Đạc",
         "companyLeaderShip": "Vũ Lãnh Đạo",
         "planningTechnicalHead": "Bùi Trưởng Ban"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0007', '606 Giải Phóng, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Bùi Văn Cường', 1, 200000,
        'https://example.com/design4.png', 1, 300000, 1, 'Hồ sơ dự toán bị từ chối, cần khảo sát lại', 'METER-024', 1,
        '2024-03-26', 1, 150000, now(),
        1, 'SN-2024-024', 80000001024, 20240024, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0008', '707 Trường Chinh, Nam Định', 1, 1050000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Đặng Thị B', 1, 210000,
        'https://example.com/design25.png', 1, 310000, 1, 'Khảo sát lắp đặt hộ gia đình', 'METER-025', 1, '2024-03-26',
        1, 155000, now(), 1, 'SN-2024-025',
        80000001025, 20240025, '{
         "surveyStaff": "Đỗ Văn Hiện Trường",
         "companyLeaderShip": "Lý Ban Điều Hành",
         "planningTechnicalHead": "Ngô Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0009', '909 Mạc Thị Bưởi, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Nguyễn Thị Q', 1, 200000,
        'https://example.com/design27.png', 1, 300000, 1, 'Kết quả khảo sát ban đầu', 'METER-027', 1, '2024-03-26', 1,
        150000, now(), 1, 'SN-2024-027',
        80000001027, 20240027, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0010', '1010 Hàng Thao, Nam Định', 1, 1300000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Trần Văn K', 1, 260000,
        'https://example.com/design5.png', 1, 360000, 1, 'Công trình đã có dự toán được duyệt', 'METER-028', 1,
        '2024-03-26', 1, 170000, now(), 1, 'SN-2024-028',
        80000001028, 20240028, '{
         "surveyStaff": "Phan Văn Thực Địa",
         "companyLeaderShip": "Bùi Giám Đốc",
         "planningTechnicalHead": "Đinh Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1029', '11 Nguyễn Du, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Nguyễn Thị Tới', 1, 200000,
        'https://example.com/design29.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-029', 1, '2024-04-01',
        1, 150000, now(), 1, 'SN-2024-029', 80000001029, 20240029, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1030', '22 Trần Phú, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Lê Văn Thắng', 1, 200000,
        'https://example.com/design30.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-030', 1, '2024-04-01',
        1, 150000, now(), 1, 'SN-2024-030', 80000001030, 20240030, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1031', '33 Lý Thường Kiệt, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Trần Thị Tuyết', 1, 200000,
        'https://example.com/design31.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-031', 1, '2024-04-01',
        1, 150000, now(), 1, 'SN-2024-031', 80000001031, 20240031, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1032', '44 Hàng Thao, Nam Định', 1, 1200000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Phạm Văn Hùng', 1, 240000,
        'https://example.com/design32.png', 1, 340000, 1, 'Lắp mới đồng hồ D15', 'METER-032', 1, '2024-04-01',
        1, 160000, now(), 1, 'SN-2024-032', 80000001032, 20240032, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1033', '55 Quang Trung, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Hoàng Thị Kim', 1, 200000,
        'https://example.com/design33.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-033', 1, '2024-04-02',
        1, 150000, now(), 1, 'SN-2024-033', 80000001033, 20240033, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1034', '66 Lê Hồng Phong, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Đỗ Văn Cường', 1, 200000,
        'https://example.com/design34.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-034', 1, '2024-04-02',
        1, 150000, now(), 1, 'SN-2024-034', 80000001034, 20240034, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1035', '77 Hùng Vương, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Bùi Thị Ngọc', 1, 200000,
        'https://example.com/design35.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-035', 1, '2024-04-02',
        1, 150000, now(), 1, 'SN-2024-035', 80000001035, 20240035, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1036', '88 Võ Nguyên Giáp, Nam Định', 1, 1200000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Võ Văn Thành', 1, 240000,
        'https://example.com/design36.png', 1, 340000, 1, 'Lắp mới đồng hồ D15', 'METER-036', 1, '2024-05-01',
        1, 160000, now(), 1, 'SN-2024-036', 80000001036, 20240036, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1037', '99 Trường Chinh, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Đặng Thị Hồng', 1, 200000,
        'https://example.com/design37.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-037', 1, '2024-05-01',
        1, 150000, now(), 1, 'SN-2024-037', 80000001037, 20240037, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg1038', '111 Điện Biên, Nam Định', 1, 1000000,
        'd75e221e-d150-4962-9afb-687062bfbcc8', now(), 'Phan Văn Minh', 1, 200000,
        'https://example.com/design38.png', 1, 300000, 1, 'Lắp mới đồng hồ D15', 'METER-038', 1, '2024-05-01',
        1, 150000, now(), 1, 'SN-2024-038', 80000001038, 20240038, '{
         "surveyStaff": "Nguyễn Văn Khảo Sát",
         "companyLeaderShip": "Lê Văn Quản Lý",
         "planningTechnicalHead": "Trần Trưởng Phòng"
       }');

INSERT INTO public.receipt (installation_form_form_code, installation_form_form_number, address, customer_name,
                            is_paid, payment_date, payment_reason, receipt_number, total_money_in_digits,
                            created_at, updated_at)
VALUES (80000001019, 20240019, '456 Lê Hồng Phong, Nam Định', 'Phạm Thị Mai', true, '2024-03-26',
        'Phí lắp đặt nước', 'REC-2024-0019', '1500000', now(), now()),
       (80000001020, 20240020, '202 Hùng Vương, Nam Định', 'Hoàng Văn Dũng', true, '2024-03-26',
        'Phí lắp đặt nước', 'REC-2024-0020', '1500000', now(), now()),
       (80000001021, 20240021, '303 Trường Chinh, Nam Định', 'Nguyễn Thị Hoa', true, '2024-03-26',
        'Phí lắp đặt nước', 'REC-2024-0021', '1500000', now(), now()),
       (80000001022, 20240022, '404 Võ Nguyên Giáp, Nam Định', 'Trần Văn Thành', true, '2024-03-26',
        'Phí lắp đặt nước', 'REC-2024-0022', '1500000', now(), now()),
       (80000001025, 20240025, '707 Trường Chinh, Nam Định', 'Đặng Thị B', true, '2024-03-26',
        'Phí lắp đặt nước', 'REC-2024-0025', '1500000', now(), now()),
       (80000001028, 20240028, '1010 Hàng Thao, Nam Định', 'Trần Văn K', true, '2024-03-26',
        'Phí lắp đặt nước', 'REC-2024-0028', '1500000', now(), now()),
       (80000001029, 20240029, '11 Nguyễn Du, Nam Định', 'Nguyễn Thị Tới', true, '2024-04-02',
        'Phí lắp đặt nước', 'REC-2024-0029', '1500000', now(), now()),
       (80000001030, 20240030, '22 Trần Phú, Nam Định', 'Lê Văn Thắng', true, '2024-04-02',
        'Phí lắp đặt nước', 'REC-2024-0030', '1500000', now(), now()),
       (80000001031, 20240031, '33 Lý Thường Kiệt, Nam Định', 'Trần Thị Tuyết', true, '2024-04-02',
        'Phí lắp đặt nước', 'REC-2024-0031', '1500000', now(), now()),
       (80000001032, 20240032, '44 Hàng Thao, Nam Định', 'Phạm Văn Hùng', true, '2024-04-02',
        'Phí lắp đặt nước', 'REC-2024-0032', '1800000', now(), now()),
       (80000001033, 20240033, '55 Quang Trung, Nam Định', 'Hoàng Thị Kim', true, '2024-04-03',
        'Phí lắp đặt nước', 'REC-2024-0033', '1500000', now(), now()),
       (80000001034, 20240034, '66 Lê Hồng Phong, Nam Định', 'Đỗ Văn Cường', true, '2024-04-03',
        'Phí lắp đặt nước', 'REC-2024-0034', '1500000', now(), now()),
       (80000001035, 20240035, '77 Hùng Vương, Nam Định', 'Bùi Thị Ngọc', true, '2024-04-03',
        'Phí lắp đặt nước', 'REC-2024-0035', '1500000', now(), now()),
       (80000001036, 20240036, '88 Võ Nguyên Giáp, Nam Định', 'Võ Văn Thành', true, '2024-05-02',
        'Phí lắp đặt nước', 'REC-2024-0036', '1800000', now(), now()),
       (80000001037, 20240037, '99 Trường Chinh, Nam Định', 'Đặng Thị Hồng', true, '2024-05-02',
        'Phí lắp đặt nước', 'REC-2024-0037', '1500000', now(), now()),
       (80000001038, 20240038, '111 Điện Biên, Nam Định', 'Phan Văn Minh', true, '2024-05-02',
        'Phí lắp đặt nước', 'REC-2024-0038', '1500000', now(), now());

insert into public.water_usage_contract (contract_id, created_at, updated_at, form_code,
                                         form_number, representative, appendix)
values ('CTR-2024-0019', current_timestamp, current_timestamp, '80000001019', '20240019', '[
  {
    "name": "Phạm Thị Mai",
    "position": "Chủ hộ"
  }
]'::jsonb, null),
       ('CTR-2024-0020', current_timestamp, current_timestamp, '80000001020', '20240020', '[
         {
           "name": "Hoàng Văn Dũng",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0021', current_timestamp, current_timestamp, '80000001021', '20240021', '[
         {
           "name": "Nguyễn Thị Hoa",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0022', current_timestamp, current_timestamp, '80000001022', '20240022', '[
         {
           "name": "Trần Văn Thành",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0025', current_timestamp, current_timestamp, '80000001025', '20240025', '[
         {
           "name": "Đặng Thị B",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0028', current_timestamp, current_timestamp, '80000001028', '20240028', '[
         {
           "name": "Trần Văn K",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0029', current_timestamp, current_timestamp, '80000001029', '20240029', '[
         {
           "name": "Nguyễn Thị Tới",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0030', current_timestamp, current_timestamp, '80000001030', '20240030', '[
         {
           "name": "Lê Văn Thắng",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0031', current_timestamp, current_timestamp, '80000001031', '20240031', '[
         {
           "name": "Trần Thị Tuyết",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0032', current_timestamp, current_timestamp, '80000001032', '20240032', '[
         {
           "name": "Phạm Văn Hùng",
           "position": "Giám đốc"
         }
       ]'::jsonb, null),
       ('CTR-2024-0033', current_timestamp, current_timestamp, '80000001033', '20240033', '[
         {
           "name": "Hoàng Thị Kim",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0034', current_timestamp, current_timestamp, '80000001034', '20240034', '[
         {
           "name": "Đỗ Văn Cường",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0035', current_timestamp, current_timestamp, '80000001035', '20240035', '[
         {
           "name": "Bùi Thị Ngọc",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0036', current_timestamp, current_timestamp, '80000001036', '20240036', '[
         {
           "name": "Võ Văn Thành",
           "position": "Giám đốc"
         }
       ]'::jsonb, null),
       ('CTR-2024-0037', current_timestamp, current_timestamp, '80000001037', '20240037', '[
         {
           "name": "Đặng Thị Hồng",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0038', current_timestamp, current_timestamp, '80000001038', '20240038', '[
         {
           "name": "Phan Văn Minh",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null);

INSERT INTO construction_request (id, contract_id, created_at, updated_at,
                                  installation_form_form_code, installation_form_form_number)
VALUES ('7a8192a3-7000-4aaa-9bbb-cccccccc0019', 'CTR-2024-0019', now(), now(),
        80000001019, 20240019),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0020', 'CTR-2024-0020', now(), now(),
        80000001020, 20240020),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0021', 'CTR-2024-0021', now(), now(),
        80000001021, 20240021),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0022', 'CTR-2024-0022', now(), now(),
        80000001022, 20240022),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0025', 'CTR-2024-0025', now(), now(),
        80000001025, 20240025),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0028', 'CTR-2024-0028', now(), now(),
        80000001028, 20240028),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0029', 'CTR-2024-0029', now(), now(), 80000001029, 20240029),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0030', 'CTR-2024-0030', now(), now(), 80000001030, 20240030),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0031', 'CTR-2024-0031', now(), now(), 80000001031, 20240031),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0032', 'CTR-2024-0032', now(), now(), 80000001032, 20240032),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0033', 'CTR-2024-0033', now(), now(), 80000001033, 20240033),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0034', 'CTR-2024-0034', now(), now(), 80000001034, 20240034),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0035', 'CTR-2024-0035', now(), now(), 80000001035, 20240035),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0036', 'CTR-2024-0036', now(), now(), 80000001036, 20240036),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0037', 'CTR-2024-0037', now(), now(), 80000001037, 20240037),
       ('7a8192a3-7000-4aaa-9bbb-cccccccc0038', 'CTR-2024-0038', now(), now(), 80000001038, 20240038);

INSERT INTO public.customer (customer_id, address, bank_account_name, bank_account_number,
                             bank_account_provider_location,
                             budget_relationship_code, citizen_identification_number, citizen_identification_provide_at,
                             created_at, email, form_code, form_number, household_registration_number, is_active,
                             is_big_customer, name, number_of_households, payment_method, phone_number,
                             protect_environment_fee, roadmap_id, type, updated_at, usage_target, water_meter_id,
                             water_meter_type, water_price_id, contract_contract_id)
VALUES ('C-1022', '404 Võ Nguyên Giáp, Nam Định', 'TRAN VAN THANH', '190312345699', 'Sacombank Nam Định',
        'QH1022', '079090000022', '2020-02-07', current_timestamp, 'thanh.tv@gmail.com', '80000001022', '20240022',
        1254321, true, false, 'Trần Văn Thành', 2, 'BANK_TRANSFER', '0901234588', 50000,
        '5e6f7081-4000-4eee-9fff-eeee4eee0003', 'FAMILY', current_timestamp, 'DOMESTIC', 'METER-022', 'MECHANICAL',
        '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0020'),
       ('C-1028', '1010 Hàng Thao, Nam Định', 'TRAN VAN K', '190312345705', 'VPBank Nam Định',
        'QH1028', '079090000028', '2020-03-05', current_timestamp, 'k.tv@gmail.com', '80000001028', '20240028',
        1054322, true, false, 'Trần Văn K', 3, 'BANK_TRANSFER', '0901234594', 50000,
        '5e6f7081-4000-4eee-9fff-eeee4eee0003', 'FAMILY', current_timestamp, 'DOMESTIC', 'METER-028', 'MECHANICAL',
        '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0028'),
       ('C-1029', '11 Nguyễn Du, Nam Định', 'NGUYEN THI TOI', '190312345706', 'Agribank Nam Định', 'QH1029',
        '079090000029', '2020-04-01', current_timestamp, 'toi.nt@gmail.com', '80000001029', '20240029', 101, true,
        false, 'Nguyễn Thị Tới', 4, 'BANK_TRANSFER', '0901234601', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-029', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0029'),
       ('C-1030', '22 Trần Phú, Nam Định', 'LE VAN THANG', '190312345707', 'BIDV Nam Định', 'QH1030', '079090000030',
        '2020-04-02', current_timestamp, 'thang.lv@gmail.com', '80000001030', '20240030', 102, true, false,
        'Lê Văn Thắng', 3, 'BANK_TRANSFER', '0901234602', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001', 'FAMILY',
        current_timestamp, 'DOMESTIC', 'METER-030', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0030'),
       ('C-1031', '33 Lý Thường Kiệt, Nam Định', 'TRAN THI TUYET', '190312345708', 'Vietcombank Nam Định', 'QH1031',
        '079090000031', '2020-04-03', current_timestamp, 'tuyet.tt@gmail.com', '80000001031', '20240031', 103, true,
        false, 'Trần Thị Tuyết', 5, 'BANK_TRANSFER', '0901234603', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-031', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0031'),
       ('C-1032', '44 Hàng Thao, Nam Định', 'PHAM VAN HUNG', '190312345709', 'Techcombank Nam Định', 'QH1032',
        '079090000032', '2020-04-04', current_timestamp, 'hung.pv@gmail.com', '80000001032', '20240032', 104, true,
        false, 'Phạm Văn Hùng', 2, 'BANK_TRANSFER', '0901234604', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'COMPANY', current_timestamp, 'COMMERCIAL', 'METER-032', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0032'),
       ('C-1033', '55 Quang Trung, Nam Định', 'HOANG THI KIM', '190312345710', 'VPBank Nam Định', 'QH1033',
        '079090000033', '2020-04-05', current_timestamp, 'kim.ht@gmail.com', '80000001033', '20240033', 105, true,
        false, 'Hoàng Thị Kim', 4, 'BANK_TRANSFER', '0901234605', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-033', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0033'),
       ('C-1034', '66 Lê Hồng Phong, Nam Định', 'DO VAN CUONG', '190312345711', 'ACB Nam Định', 'QH1034',
        '079090000034', '2020-04-06', current_timestamp, 'cuong.dv@gmail.com', '80000001034', '20240034', 106, true,
        false, 'Đỗ Văn Cường', 3, 'BANK_TRANSFER', '0901234606', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-034', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0034'),
       ('C-1035', '77 Hùng Vương, Nam Định', 'BUI THI NGOC', '190312345712', 'Sacombank Nam Định', 'QH1035',
        '079090000035', '2020-04-07', current_timestamp, 'ngoc.bt@gmail.com', '80000001035', '20240035', 107, true,
        false, 'Bùi Thị Ngọc', 5, 'BANK_TRANSFER', '0901234607', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-035', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0035'),
       ('C-1036', '88 Võ Nguyên Giáp, Nam Định', 'VO VAN THANH', '190312345713', 'Maritime Bank', 'QH1036',
        '079090000036', '2020-05-01', current_timestamp, 'thanh.vv@gmail.com', '80000001036', '20240036', 108, true,
        false, 'Võ Văn Thành', 2, 'BANK_TRANSFER', '0901234608', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0002',
        'COMPANY', current_timestamp, 'COMMERCIAL', 'METER-036', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0036'),
       ('C-1037', '99 Trường Chinh, Nam Định', 'DANG THI HONG', '190312345714', 'SeABank', 'QH1037', '079090000037',
        '2020-05-02', current_timestamp, 'hong.dt@gmail.com', '80000001037', '20240037', 109, true, false,
        'Đặng Thị Hồng', 4, 'BANK_TRANSFER', '0901234609', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0002', 'FAMILY',
        current_timestamp, 'DOMESTIC', 'METER-037', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0037'),
       ('C-1038', '111 Điện Biên, Nam Định', 'PHAN VAN MINH', '190312345715', 'TPBank', 'QH1038', '079090000038',
        '2020-05-03', current_timestamp, 'minh.pv@gmail.com', '80000001038', '20240038', 110, true, false,
        'Phan Văn Minh', 3, 'BANK_TRANSFER', '0901234610', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0002', 'FAMILY',
        current_timestamp, 'DOMESTIC', 'METER-038', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001', 'CTR-2024-0038');


INSERT INTO public.settlement (settlement_id, address, connection_fee, created_at, job_content, note, registration_at,
                               significance, updated_at, installation_form_form_code, installation_form_form_number)
VALUES ('SETTLE-2024-0022', '404 Võ Nguyên Giáp, Nam Định', 1500000, now(), 'Lắp đặt đường ống nhánh và đồng hồ D15',
        'Công trình hoàn thành đúng thiết kế, đã nghiệm thu.', '2024-03-25', '{
    "materialStaff": "Nguyễn Văn Kho",
    "constructionHead": "Trịnh Trưởng Phòng",
    "financeStaff": "Lê Kế Toán"
  }', now(), '80000001022', '20240022'),
       ('SETTLE-2024-0028', '1010 Hàng Thao, Nam Định', 1800000, now(), 'Lắp đặt hệ thống cấp nước hộ gia đình',
        'Nghiệm thu đạt chuẩn kỹ thuật, bàn giao sử dụng.', '2024-03-26', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), '80000001028', '20240028'),
       ('SETTLE-2024-0029', '11 Nguyễn Du, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành', '2024-04-01',
        '{
          "materialStaff": "Nguyễn Văn Kho",
          "constructionHead": "Trịnh Trưởng Phòng",
          "financeStaff": "Lê Kế Toán"
        }', now(), 80000001029, 20240029),
       ('SETTLE-2024-0030', '22 Trần Phú, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành', '2024-04-01',
        '{
          "materialStaff": "Nguyễn Văn Kho",
          "constructionHead": "Trịnh Trưởng Phòng",
          "financeStaff": "Lê Kế Toán"
        }', now(), 80000001030, 20240030),
       ('SETTLE-2024-0031', '33 Lý Thường Kiệt, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành',
        '2024-04-01', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), 80000001031, 20240031),
       ('SETTLE-2024-0032', '44 Hàng Thao, Nam Định', 1800000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành', '2024-04-01',
        '{
          "materialStaff": "Nguyễn Văn Kho",
          "constructionHead": "Trịnh Trưởng Phòng",
          "financeStaff": "Lê Kế Toán"
        }', now(), 80000001032, 20240032),
       ('SETTLE-2024-0033', '55 Quang Trung, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành',
        '2024-04-02', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), 80000001033, 20240033),
       ('SETTLE-2024-0034', '66 Lê Hồng Phong, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành',
        '2024-04-02', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), 80000001034, 20240034),
       ('SETTLE-2024-0035', '77 Hùng Vương, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành',
        '2024-04-02', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), 80000001035, 20240035),
       ('SETTLE-2024-0036', '88 Võ Nguyên Giáp, Nam Định', 1800000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành',
        '2024-05-01', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), 80000001036, 20240036),
       ('SETTLE-2024-0037', '99 Trường Chinh, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành',
        '2024-05-01', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), 80000001037, 20240037),
       ('SETTLE-2024-0038', '111 Điện Biên, Nam Định', 1500000, now(), 'Lắp mới đồng hồ D15', 'Hoàn thành',
        '2024-05-01', '{
         "materialStaff": "Nguyễn Văn Kho",
         "constructionHead": "Trịnh Trưởng Phòng",
         "financeStaff": "Lê Kế Toán"
       }', now(), 80000001038, 20240038);

-- device
INSERT INTO public.parameters (param_id, created_at, creator, name, updated_at, updator, value)
VALUES ('00000000-0000-0000-0000-100000000001', NOW(), '6e9f757b-6fa1-4aa6-b7cb-a4cf2290eb20', 'Phí tạo lập hợp đồng',
        NOW(),
        '6e9f757b-6fa1-4aa6-b7cb-a4cf2290eb20', 101),
       ('00000000-0000-0000-0000-100000000002', NOW(), '14c5879c-a6c4-45a6-846b-39d2b9d8c961', 'Phí khảo sát', NOW(),
        '14c5879c-a6c4-45a6-846b-39d2b9d8c961', 102),
       ('00000000-0000-0000-0000-100000000003', NOW(), 'c8357517-3149-41b4-9b2c-881d5a40840a', 'Phí lập đơn lắp đặt',
        NOW(),
        'c8357517-3149-41b4-9b2c-881d5a40840a', 103),
       ('00000000-0000-0000-0000-100000000004', NOW(), 'bd5bc9bb-303d-425f-9f2e-90f83ef75ee8', 'Hệ số chi phí chung',
        NOW(),
        'bd5bc9bb-303d-425f-9f2e-90f83ef75ee8', 104),
       ('00000000-0000-0000-0000-100000000005', NOW(), '1cef2ae0-3151-405c-b717-61be20679d79', 'Hệ số thuế tính trước',
        NOW(),
        '1cef2ae0-3151-405c-b717-61be20679d79', 105),
       ('00000000-0000-0000-0000-100000000006', NOW(), '71bc19b9-4a86-4ff9-aa26-3fc037569cfd', 'Hệ số VAT', NOW(),
        '71bc19b9-4a86-4ff9-aa26-3fc037569cfd', 106),
       ('00000000-0000-0000-0000-100000000007', NOW(), 'eae87df0-7f02-47b9-baa2-ac2bc9ea61fb', 'Hệ số thiết kế', NOW(),
        'eae87df0-7f02-47b9-baa2-ac2bc9ea61fb', 107),
       ('00000000-0000-0000-0000-100000000008', NOW(), 'd4039a01-4408-4fad-8676-05ef81532eb5', 'Phí thiết kế', NOW(),
        'd4039a01-4408-4fad-8676-05ef81532eb5', 108);

INSERT INTO public.materials_group (group_id, created_at, name, updated_at)
VALUES ('00000000-0000-0000-0000-200000000001', NOW(), 'Bu', NOW()),
       ('00000000-0000-0000-0000-200000000002', NOW(), 'Côn', NOW()),
       ('00000000-0000-0000-0000-200000000003', NOW(), 'Công', NOW()),
       ('00000000-0000-0000-0000-200000000004', NOW(), 'Cút', NOW()),
       ('00000000-0000-0000-0000-200000000005', NOW(), 'Đầu bịt', NOW()),
       ('00000000-0000-0000-0000-200000000006', NOW(), 'Đầu gai', NOW()),
       ('00000000-0000-0000-0000-200000000007', NOW(), 'Đồng hồ', NOW()),
       ('00000000-0000-0000-0000-200000000008', NOW(), 'Đai khởi thủy', NOW()),
       ('00000000-0000-0000-0000-200000000009', NOW(), 'Hộp đồng hồ', NOW()),
       ('00000000-0000-0000-0000-200000000010', NOW(), 'Không là vật tư', NOW()),
       ('00000000-0000-0000-0000-200000000011', NOW(), 'Ống', NOW()),
       ('00000000-0000-0000-0000-200000000012', NOW(), 'Măng sông', NOW()),
       ('00000000-0000-0000-0000-200000000013', NOW(), 'Van', NOW()),
       ('00000000-0000-0000-0000-200000000014', NOW(), 'Kép', NOW()),
       ('00000000-0000-0000-0000-200000000020', NOW(), 'Vòi', NOW()),
       ('00000000-0000-0000-0000-200000000021', NOW(), 'Tê', NOW()),
       ('00000000-0000-0000-0000-200000000022', NOW(), 'Rắc co', NOW());

INSERT INTO public.unit (unit_id, created_at, name, updated_at)
VALUES ('00000000-0000-0000-0000-300000000001', NOW(), 'Bình', NOW()),
       ('00000000-0000-0000-0000-300000000002', NOW(), 'Bộ', NOW()),
       ('00000000-0000-0000-0000-300000000003', NOW(), 'Ca', NOW()),
       ('00000000-0000-0000-0000-300000000004', NOW(), 'Cái', NOW()),
       ('00000000-0000-0000-0000-300000000005', NOW(), 'Con', NOW()),
       ('00000000-0000-0000-0000-300000000006', NOW(), 'Công', NOW()),
       ('00000000-0000-0000-0000-300000000007', NOW(), 'Cuộn', NOW()),
       ('00000000-0000-0000-0000-300000000008', NOW(), 'Điểm', NOW()),
       ('00000000-0000-0000-0000-300000000009', NOW(), 'Đoạn', NOW()),
       ('00000000-0000-0000-0000-300000000010', NOW(), 'Đồng', NOW()),
       ('00000000-0000-0000-0000-300000000011', NOW(), 'Hố', NOW()),
       ('00000000-0000-0000-0000-300000000012', NOW(), 'Hộ', NOW()),
       ('00000000-0000-0000-0000-300000000013', NOW(), 'KG', NOW()),
       ('00000000-0000-0000-0000-300000000014', NOW(), 'Lít', NOW()),
       ('00000000-0000-0000-0000-300000000015', NOW(), 'Lon', NOW()),
       ('00000000-0000-0000-0000-300000000016', NOW(), 'Lưỡi', NOW()),
       ('00000000-0000-0000-0000-300000000017', NOW(), 'M2', NOW()),
       ('00000000-0000-0000-0000-300000000018', NOW(), 'M3', NOW()),
       ('00000000-0000-0000-0000-300000000019', NOW(), 'Mét', NOW()),
       ('00000000-0000-0000-0000-300000000020', NOW(), 'Mối', NOW()),
       ('00000000-0000-0000-0000-300000000021', NOW(), 'Ống', NOW()),
       ('00000000-0000-0000-0000-300000000022', NOW(), 'Quyển', NOW()),
       ('00000000-0000-0000-0000-300000000023', NOW(), 'Tấm', NOW()),
       ('00000000-0000-0000-0000-300000000024', NOW(), 'Tuýp', NOW()),
       ('00000000-0000-0000-0000-300000000025', NOW(), 'Viên', NOW()),
       ('00000000-0000-0000-0000-300000000026', NOW(), 'Đợt', NOW());

INSERT INTO public.overall_water_meter (serial, lateral_id, name)
VALUES ('00000000-0000-0000-0000-400000000001', '4d5e6f70-3000-4ddd-9eee-dddddddd0002', '195'),
       ('00000000-0000-0000-0000-400000000002', '4d5e6f70-3000-4ddd-9eee-dddddddd0002', '195 (CQ)'),
       ('00000000-0000-0000-0000-400000000003', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '14'),
       ('00000000-0000-0000-0000-400000000004', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '14CQ'),
       ('00000000-0000-0000-0000-400000000005', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '13'),
       ('00000000-0000-0000-0000-400000000006', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '07V'),
       ('00000000-0000-0000-0000-400000000007', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '08V'),
       ('00000000-0000-0000-0000-400000000008', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '10V'),
       ('00000000-0000-0000-0000-400000000009', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '06V'),
       ('00000000-0000-0000-0000-400000000010', '4d5e6f70-3000-4ddd-9eee-dddddddd0001', '172');

INSERT INTO public.price_type (price_type_id, area, price)
VALUES ('00000000-0000-0000-0000-500000000001', '1', '{
  "price": 8000,
  "step": 1
}'),
       ('00000000-0000-0000-0000-500000000002', '1', '{
         "price": 9600,
         "step": 2
       }'),
       ('00000000-0000-0000-0000-500000000003', '1', '{
         "price": 11200,
         "step": 3
       }'),
       ('00000000-0000-0000-0000-500000000004', '1', '{
         "price": 11800
       }'),
       ('00000000-0000-0000-0000-500000000005', '1', '{
         "price": 12500
       }'),
       ('00000000-0000-0000-0000-500000000006', '1', '{
         "price": 20000
       }'),
       ('00000000-0000-0000-0000-500000000007', '2', '{
         "price": 7700,
         "step": 1
       }'),
       ('00000000-0000-0000-0000-500000000008', '2', '{
         "price": 9600
       }'),
       ('00000000-0000-0000-0000-500000000009', '2', '{
         "price": 12000
       }'),
       ('00000000-0000-0000-0000-500000000010', '2', '{
         "price": 20000
       }');

INSERT INTO public.material (material_id, labor_code, construction_machinery_price,
                             construction_machinery_price_at_rural_commune, created_at, job_content, labor_price,
                             labor_price_at_rural_commune, price, updated_at, supplies_group_id, calculation_unit_id)
VALUES ('00000000-0000-0000-0000-600000000001', 'DKT225', 0.00, 0.00, NOW(), 'Đai khởi thủy HDPE OD225x1/2"', 0.00,
        0.00, 490000.00, NOW(), '00000000-0000-0000-0000-200000000008', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000002', 'TT', 0.00, 0.00, NOW(), 'Băng cao su (2350)', 0.00, 0.00, 2350.00,
        NOW(), '00000000-0000-0000-0000-200000000010', '00000000-0000-0000-0000-300000000007'),
       ('00000000-0000-0000-0000-600000000003', 'tt', 0.00, 0.00, NOW(), 'Băng cao su (3000)', 0.00, 0.00, 3000.00,
        NOW(), '00000000-0000-0000-0000-200000000010', '00000000-0000-0000-0000-300000000007'),
       ('00000000-0000-0000-0000-600000000004', 'TT', 0.00, 0.00, NOW(), 'Bulong mạ kẽm', 0.00, 0.00, 18000.00, NOW(),
        '00000000-0000-0000-0000-200000000001', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000005', 'BB.83104', 0.00, 0.00, NOW(), 'Bu bích nhựa HDPE OD90', 0.00, 0.00,
        983248.00, NOW(), '00000000-0000-0000-0000-200000000001', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000006', 'BB.83102', 0.00, 0.00, NOW(), 'Bu bích nhựa HDPE OD63x2', 42660.00,
        38394.00, 693000.00, NOW(), '00000000-0000-0000-0000-200000000001', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000007', 'BB.83102', 0.00, 0.00, NOW(), 'Bu bích nhựa HDPE OD63x2"', 42660.00,
        38394.00, 693000.00, NOW(), '00000000-0000-0000-0000-200000000001', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000008', 'AB.13412', 0.00, 0.00, NOW(), 'Cát đen lấp ống', 0.00, 0.00, 90000.00,
        NOW(), '00000000-0000-0000-0000-200000000010', '00000000-0000-0000-0000-300000000018'),
       ('00000000-0000-0000-0000-600000000009', 'BB.73302', 0.00, 0.00, NOW(), 'Côn Inox DN20x15', 29920.00, 26928.00,
        22600.00, NOW(), '00000000-0000-0000-0000-200000000002', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000010', 'BB.73102', 0.00, 0.00, NOW(), 'Côn thép DN20x15', 27336.00, 24602.40,
        6200.00, NOW(), '00000000-0000-0000-0000-200000000002', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000011', 'LC-11', 0.00, 0.00, NOW(), 'Ống nhựa HDPE - PE80-OD20 PN12,5', 0.00,
        0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000011', '00000000-0000-0000-0000-300000000019'),
       ('00000000-0000-0000-0000-600000000012', 'LC-12', 0.00, 0.00, NOW(), 'Măng sông 1 đầu ren trong HDPE OD20x1/2',
        0.00, 0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000012', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000013', 'LC-13', 0.00, 0.00, NOW(), 'Ống thép tráng kẽm DN15', 0.00, 0.00, 0.00,
        NOW(), '00000000-0000-0000-0000-200000000011', '00000000-0000-0000-0000-300000000019'),
       ('00000000-0000-0000-0000-600000000014', 'LC-14', 0.00, 0.00, NOW(),
        'Đồng hồ đo nước MultimagS DN15 cấp C (đã bao gồm phí kiểm định ĐH)', 0.00, 0.00, 0.00, NOW(),
        '00000000-0000-0000-0000-200000000007', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000015', 'LC-15', 0.00, 0.00, NOW(),
        'Van góc đồng có van 1 chiều hiệu MIHA DN15', 0.00, 0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000013',
        '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000016', 'LC-16', 0.00, 0.00, NOW(),
        'Van góc đồng không có van 1 chiều hiệu MIHA DN15', 0.00, 0.00, 0.00, NOW(),
        '00000000-0000-0000-0000-200000000013', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000017', 'LC-17', 0.00, 0.00, NOW(), 'Hộp nhựa bảo vệ đồng hồ KT: 350x150x170',
        0.00, 0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000009', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000018', 'LC-18', 0.00, 0.00, NOW(), 'Cút Côn Inox 90 độ DN20x15', 0.00, 0.00,
        0.00, NOW(), '00000000-0000-0000-0000-200000000004', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000019', 'LC-19', 0.00, 0.00, NOW(), 'Kép inox DN15', 0.00, 0.00, 0.00, NOW(),
        '00000000-0000-0000-0000-200000000014', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000020', 'LC-20', 0.00, 0.00, NOW(), 'Cút Inox 90 độ DN15', 0.00, 0.00, 0.00,
        NOW(), '00000000-0000-0000-0000-200000000004', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000021', 'LC-21', 0.00, 0.00, NOW(), 'Vòi hợp kim DN15', 0.00, 0.00, 0.00, NOW(),
        '00000000-0000-0000-0000-200000000020', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000022', 'LC-22', 0.00, 0.00, NOW(), 'Kép tiện inox 304 DN15 (L = 10cm)', 0.00,
        0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000014', '00000000-0000-0000-0000-300000000009'),
       ('00000000-0000-0000-0000-600000000023', 'LC-23', 0.00, 0.00, NOW(), 'Nhân công lấp cát đen', 0.00, 0.00, 0.00,
        NOW(), '00000000-0000-0000-0000-200000000003', '00000000-0000-0000-0000-300000000018'),
       ('00000000-0000-0000-0000-600000000024', 'LC-24', 0.00, 0.00, NOW(), 'Nhân công vận chuyển vật tư', 0.00, 0.00,
        0.00, NOW(), '00000000-0000-0000-0000-200000000003', '00000000-0000-0000-0000-300000000026'),
       ('00000000-0000-0000-0000-600000000025', 'LC-25', 0.00, 0.00, NOW(), 'Nước thất thoát', 0.00, 0.00, 0.00, NOW(),
        '00000000-0000-0000-0000-200000000010', '00000000-0000-0000-0000-300000000018'),
       ('00000000-0000-0000-0000-600000000026', 'LC-26', 0.00, 0.00, NOW(),
        'Nhân công nghiệm thu, kẹp chì, bàn giao đưa vào quản lý, sử dụng', 0.00, 0.00, 0.00, NOW(),
        '00000000-0000-0000-0000-200000000003', '00000000-0000-0000-0000-300000000006'),
       ('00000000-0000-0000-0000-600000000027', 'LC-27', 0.00, 0.00, NOW(), 'Đại khởi thủy HDPE OD40x1/2"', 0.00, 0.00,
        0.00, NOW(), '00000000-0000-0000-0000-200000000008', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000028', 'LC-28', 0.00, 0.00, NOW(), 'Nhân công đào đất cấp 3', 0.00, 0.00, 0.00,
        NOW(), '00000000-0000-0000-0000-200000000003', '00000000-0000-0000-0000-300000000018'),
       ('00000000-0000-0000-0000-600000000029', 'LC-29', 0.00, 0.00, NOW(), 'Ống nhựa HDPE - PE80-OD25 PN10', 0.00,
        0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000011', '00000000-0000-0000-0000-300000000019'),
       ('00000000-0000-0000-0000-600000000030', 'LC-30', 0.00, 0.00, NOW(), 'Tê Nhựa 25 x 25 Malaysia', 0.00, 0.00,
        0.00, NOW(), '00000000-0000-0000-0000-200000000021', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000031', 'LC-31', 0.00, 0.00, NOW(), 'Măng sông nhựa HDPE OD 20x20 Malaysia',
        0.00, 0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000012', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000032', 'LC-32', 0.00, 0.00, NOW(), 'Măng sông', 0.00, 0.00, 0.00, NOW(),
        '00000000-0000-0000-0000-200000000012', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000033', 'LC-33', 0.00, 0.00, NOW(), 'Van 2 chiều hiệu MIHA DN15', 0.00, 0.00,
        0.00, NOW(), '00000000-0000-0000-0000-200000000013', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000034', 'LC-34', 0.00, 0.00, NOW(), 'Van 1 chiều hiệu MIHA DN15', 0.00, 0.00,
        0.00, NOW(), '00000000-0000-0000-0000-200000000013', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000035', 'LC-35', 0.00, 0.00, NOW(), 'Hộp nhựa bảo vệ đồng hồ KT: 400x200x200',
        0.00, 0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000009', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000036', 'LC-36', 0.00, 0.00, NOW(), 'Cút Inox 90 độ DN15 - 1 đầu ren ngoài',
        0.00, 0.00, 0.00, NOW(), '00000000-0000-0000-0000-200000000004', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000037', 'LC-37', 0.00, 0.00, NOW(), 'Măng sông thép DN 15', 0.00, 0.00, 0.00,
        NOW(), '00000000-0000-0000-0000-200000000012', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000038', 'LC-38', 0.00, 0.00, NOW(), 'Rắc co đồng hồ DN15', 0.00, 0.00, 0.00,
        NOW(), '00000000-0000-0000-0000-200000000022', '00000000-0000-0000-0000-300000000004'),
       ('00000000-0000-0000-0000-600000000039', 'LC-39', 0.00, 0.00, NOW(), 'Hợp đồng lắp đặt đồng hồ', 0.00, 0.00,
        0.00, NOW(), '00000000-0000-0000-0000-200000000010', '00000000-0000-0000-0000-300000000004');

INSERT INTO public.water_meter_type (type_id, created_at, diameter, max_index, meter_model, name, origin, qmin, qn, qt,
                                     size, updated_at)
VALUES ('00000000-0000-0000-0000-900000000001', NOW(), 100.0, '999999', 'WPD-DN100', 'Sensus', 'Sensus', '1.5', '2.5',
        '3.5', 100, NOW()),
       ('00000000-0000-0000-0000-900000000002', NOW(), 50.0, '999999', 'DN50 cấp B', 'Woltek', 'Woltek', '1.5', '2.5',
        '3.5', 50, NOW()),
       ('00000000-0000-0000-0000-900000000003', NOW(), 25.0, '999999', 'DN25 cấp C', 'Flodis', 'Flodis', '1.5', '2.5',
        '3.5', 25, NOW()),
       ('00000000-0000-0000-0000-900000000004', NOW(), 32.0, '999999', 'DN32 cấp C', 'Flodis', 'Flodis', '1.5', '2.5',
        '3.5', 32, NOW()),
       ('00000000-0000-0000-0000-900000000005', NOW(), 50.0, '999999', 'DN50 cấp C', 'Flostar', 'Flostar', '1.5', '2.5',
        '3.5', 50, NOW()),
       ('00000000-0000-0000-0000-900000000006', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Woltex', 'Indonesia', '1.5',
        '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000007', NOW(), 25.0, '999999', 'Tốc độ-Đa tia',
        'Đồng hồ đo nước Multimag Cyble', 'Itron', '1.5', '2.5', '3.5', 25, NOW()),
       ('00000000-0000-0000-0000-900000000008', NOW(), 15.0, '999999',
        'Đồng hồ CD SD Plus là đồng hồ đơn tia mặt số khô', 'Đồng hồ đo nước Maddalena-Italia DN15 Cấp C', 'Italia',
        '1.5', '2.5', '10.0', 15, NOW()),
       ('00000000-0000-0000-0000-900000000009', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Bồ Đào Nha', 'Bồ Đào Nha',
        '1.5', '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000010', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Kent KSM (bảo dưỡng)',
        'Malaysia', '1.5', '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000011', NOW(), 15.0, '999999', 'Sima', 'Multimag S - Cấp C', 'PHÁP', '1.5',
        '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000012', NOW(), 32.0, '999999', 'Mẫu tiêu chuẩn', 'Multimag (32)', 'Pháp', '1.5',
        '2.5', '3.5', 32, NOW()),
       ('00000000-0000-0000-0000-900000000013', NOW(), 50.0, '999999', 'Mẫu tiêu chuẩn',
        'Đồng hồ đo nước hãng Itron hiệu Woltex cấp B', 'Pháp', '1.5', '2.5', '3.5', 50, NOW()),
       ('00000000-0000-0000-0000-900000000014', NOW(), 15.0, '999999', 'cơ điện tử', 'Thái Aichi', 'Thái Lan', '1.5',
        '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000015', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Pháp Multimag', 'Pháp', '1.5',
        '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000016', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Arad-Israel', 'Israel', '1.5',
        '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000017', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Klepsan - Cấp C',
        'Thổ Nhĩ Kỳ', '1.5', '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000018', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Malaysia Ken', 'Malaysia',
        '1.5', '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000019', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Đồng hồ xuất xứ từ Đức',
        'Đức', '1.5', '2.5', '3.5', 15, NOW()),
       ('00000000-0000-0000-0000-900000000020', NOW(), 15.0, '999999', 'Mẫu tiêu chuẩn', 'Quốc Phòng', 'Quốc Phòng',
        '1.5', '2.5', '3.5', 15, NOW());

INSERT INTO public.water_meter (meter_code, installation_date, size, water_meter_type_id)
VALUES ('00000000-0000-0000-0000-A00000000001', '2023-01-01', 21, '00000000-0000-0000-0000-900000000001'),
       ('00000000-0000-0000-0000-A00000000002', '2023-01-01', 22, '00000000-0000-0000-0000-900000000002'),
       ('00000000-0000-0000-0000-A00000000003', '2023-01-01', 23, '00000000-0000-0000-0000-900000000003'),
       ('00000000-0000-0000-0000-A00000000004', '2023-01-01', 24, '00000000-0000-0000-0000-900000000004'),
       ('00000000-0000-0000-0000-A00000000005', '2023-01-01', 25, '00000000-0000-0000-0000-900000000005'),
       ('00000000-0000-0000-0000-A00000000006', '2023-01-01', 26, '00000000-0000-0000-0000-900000000006'),
       ('00000000-0000-0000-0000-A00000000007', '2023-01-01', 27, '00000000-0000-0000-0000-900000000007'),
       ('00000000-0000-0000-0000-A00000000008', '2023-01-01', 28, '00000000-0000-0000-0000-900000000008'),
       ('00000000-0000-0000-0000-A00000000009', '2023-01-01', 29, '00000000-0000-0000-0000-900000000009'),
       ('00000000-0000-0000-0000-A00000000010', '2023-01-01', 30, '00000000-0000-0000-0000-900000000010'),
       ('00000000-0000-0000-0000-A00000000011', '2023-01-01', 31, '00000000-0000-0000-0000-900000000011'),
       ('00000000-0000-0000-0000-A00000000012', '2023-01-01', 32, '00000000-0000-0000-0000-900000000012'),
       ('00000000-0000-0000-0000-A00000000013', '2023-01-01', 33, '00000000-0000-0000-0000-900000000013'),
       ('00000000-0000-0000-0000-A00000000014', '2023-01-01', 34, '00000000-0000-0000-0000-900000000014'),
       ('00000000-0000-0000-0000-A00000000015', '2023-01-01', 35, '00000000-0000-0000-0000-900000000015');

INSERT INTO public.water_price (price_id, application_period, created_at, description, environment_price,
                                expiration_date, tax, updated_at, usage_target)
VALUES ('00000000-0000-0000-0000-B00000000001', '2018-01-01', NOW(), 'Giá nước sinh hoạt dân cư mức 1 khu vực 1', 10.00,
        '2019-01-01', 400000.00, NOW(), 'DOMESTIC'),
       ('00000000-0000-0000-0000-B00000000005', '2019-02-01', NOW(), 'Giá nước sinh hoạt dân cư mức 2 khu vực 1', 10.00,
        '2019-04-01', 480000.00, NOW(), 'DOMESTIC'),
       ('00000000-0000-0000-0000-B00000000009', '2019-05-01', NOW(), 'Giá nước sinh hoạt dân cư mức 3 khu vực 1', 10.00,
        '2019-06-01', 560000.00, NOW(), 'DOMESTIC'),
       ('00000000-0000-0000-0000-B00000000013', '2019-07-01', NOW(), 'Giá nước sinh hoạt dân cư khu vực 2', 10.00,
        '2050-01-01', 385000.00, NOW(), 'DOMESTIC'),
       ('00000000-0000-0000-0000-B00000000002', '2018-01-01', NOW(), 'Giá nước hành chính sự nghiệp khu vực 1', 10.00,
        '2019-01-01', 590000.00, NOW(), 'INSTITUTIONAL'),
       ('00000000-0000-0000-0000-B00000000006', '2019-02-01', NOW(), 'Giá nước hành chính sự nghiệp khu vực 2', 10.00,
        '2019-04-01', 480000.00, NOW(), 'INSTITUTIONAL'),
       ('00000000-0000-0000-0000-B00000000003', '2018-01-01', NOW(), 'Giá nước sản xuất vật chất khu vực 1', 10.00,
        '2019-01-01', 625000.00, NOW(), 'INDUSTRIAL'),
       ('00000000-0000-0000-0000-B00000000007', '2019-02-01', NOW(), 'Giá nước sản xuất vật chất khu vực 2', 10.00,
        '2019-04-01', 500000.00, NOW(), 'INDUSTRIAL'),
       ('00000000-0000-0000-0000-B00000000004', '2018-01-01', NOW(), 'Giá nước kinh doanh dịch vụ khu vực 1', 10.00,
        '2019-01-01', 1000000.00, NOW(), 'COMMERCIAL'),
       ('00000000-0000-0000-0000-B00000000008', '2019-02-01', NOW(), 'Giá nước kinh doanh dịch vụ khu vực 2', 10.00,
        '2019-04-01', 1000000.00, NOW(), 'COMMERCIAL');

INSERT INTO public.water_price_price_types (water_price_price_id, price_types_price_type_id)
VALUES ('00000000-0000-0000-0000-B00000000001', '00000000-0000-0000-0000-500000000001'),
       ('00000000-0000-0000-0000-B00000000001', '00000000-0000-0000-0000-500000000002'),
       ('00000000-0000-0000-0000-B00000000001', '00000000-0000-0000-0000-500000000003'),
       ('00000000-0000-0000-0000-B00000000005', '00000000-0000-0000-0000-500000000002'),
       ('00000000-0000-0000-0000-B00000000009', '00000000-0000-0000-0000-500000000003'),
       ('00000000-0000-0000-0000-B00000000013', '00000000-0000-0000-0000-500000000007'),
       ('00000000-0000-0000-0000-B00000000002', '00000000-0000-0000-0000-500000000004'),
       ('00000000-0000-0000-0000-B00000000006', '00000000-0000-0000-0000-500000000008'),
       ('00000000-0000-0000-0000-B00000000003', '00000000-0000-0000-0000-500000000005'),
       ('00000000-0000-0000-0000-B00000000007', '00000000-0000-0000-0000-500000000009'),
       ('00000000-0000-0000-0000-B00000000004', '00000000-0000-0000-0000-500000000006'),
       ('00000000-0000-0000-0000-B00000000008', '00000000-0000-0000-0000-500000000010');

-- organization
INSERT INTO public.business_page (page_id, activate, creator, name, updator)
VALUES ('86088520-f274-4ac2-a94b-b761995abf4a', true, 'admin', 'Trang chủ', 'admin'),
       ('4c3cdd22-5018-482c-bc34-51331e7167a9', true, 'admin', 'Lập hợp đồng cấp nước mới', 'admin'),
       ('b4758afc-f456-4538-aabe-3d09a4591f34', true, 'admin', 'Đơn lắp đặt mới', 'admin'),
       ('b13d7531-4935-4da6-972e-04bbda46b47a', true, 'admin', 'Tra cứu đơn lắp đặt mới', 'admin'),
       ('88e1d15b-2407-487f-b4e1-aa96e18f0d85', true, 'admin', 'Tra cứu khách hàng', 'admin'),
       ('ceedf230-1a7a-4c9d-b0c1-ce635d301ff3', true, 'admin', 'Khôi phục khách hàng hủy', 'admin'),
       ('739f3f11-6947-4135-98ed-f3e59e790d1b', true, 'admin', 'Nhập khách hàng mới', 'admin'),
       ('f16aa118-8f06-42c6-93f8-22fd9e06e071', true, 'admin', 'Danh sách đơn chờ dự toán', 'admin'),
       ('f16aa118-8f06-42c6-93f8-22fd9e06e072', true, 'admin', 'Danh sách đơn chờ duyệt dự toán', 'admin'),
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
       ('a8497645-0371-468e-a2f0-e69676e19194', 'Chi nhánh chống thất thoát', null),
       ('307791fc-d4b8-4325-bbfb-776ff3605179', 'Lãnh đạo', null);

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
       ('56475704-5001-443b-a25e-e47573677461', CURRENT_TIMESTAMP, 'Nhân viên nghiệm thu công trình',
        CURRENT_TIMESTAMP),
       ('2060377b-665e-49b4-825e-d21820625406', CURRENT_TIMESTAMP, 'Nhân viên sửa chữa', CURRENT_TIMESTAMP),
       ('09492160-c3d3-467a-b924-cc0985550c60', CURRENT_TIMESTAMP, 'Nhân viên thi công', CURRENT_TIMESTAMP),
       ('50212f45-0370-4322-a7d5-d14300329759', CURRENT_TIMESTAMP, 'Nhân viên thu tiền nước', CURRENT_TIMESTAMP),
       ('47585141-9496-4148-8df5-e1150495368a', CURRENT_TIMESTAMP, 'Nhân viên văn phòng', CURRENT_TIMESTAMP),
       ('0a082087-0b13-491b-b72e-848821958210', CURRENT_TIMESTAMP, 'Nhập chỉ số đồng hồ', CURRENT_TIMESTAMP),
       ('0684277b-7b06-4475-8162-817651877607', CURRENT_TIMESTAMP, 'Nhập khách hàng và phân lộ trình',
        CURRENT_TIMESTAMP),
       ('36526154-1296-4660-8488-842230006322', CURRENT_TIMESTAMP, 'Phó giám đốc chi nhánh', CURRENT_TIMESTAMP),
       ('06085521-1221-4470-8255-888461741517', CURRENT_TIMESTAMP, 'Phó phòng', CURRENT_TIMESTAMP),
       ('96336688-2122-4462-8114-118833989911', CURRENT_TIMESTAMP, 'Quản trị hệ thống', CURRENT_TIMESTAMP),
       ('55266155-5221-4471-8963-229944118822', CURRENT_TIMESTAMP, 'Thay đồng hồ', CURRENT_TIMESTAMP),
       ('44115599-2288-4433-7744-996633221144', CURRENT_TIMESTAMP, 'Thiết kế dự toán', CURRENT_TIMESTAMP),
       ('88552211-1144-4477-8855-663322114477', CURRENT_TIMESTAMP, 'Trưởng phòng', CURRENT_TIMESTAMP);

-- water_usage_contract
INSERT INTO public.water_usage_contract (contract_id, created_at, form_code, form_number, updated_at)
VALUES ('CONT-001', NOW(), 'FORM-TEST-001', 'FN-001', NOW()),
       ('CONT-002', NOW(), 'FORM-TEST-002', 'FN-002', NOW()),
       ('CONT-003', NOW(), 'FORM-TEST-003', 'FN-003', NOW());

-- customer
INSERT INTO public.customer (customer_id, address, bank_account_name, bank_account_number, bank_account_provider_location, created_at, email, form_code, form_number, household_registration_number, is_active, is_big_customer, name, number_of_households, payment_method, phone_number, protect_environment_fee, roadmap_id, type, updated_at, usage_target, water_meter_id, water_meter_type, water_price_id, citizen_identification_number, citizen_identification_provide_at, contract_contract_id)
VALUES ('CUST-001', '123 Đường ABC, Hà Nội', 'NGUYEN VAN A', '123456789', 'Hà Nội', NOW(), 'customer1@example.com', 'FORM-TEST-001', 'FN-001', 1, true, false, 'Nguyễn Văn A', 1, 'CASH', '0987654321', 10, '5e6f7081-4000-4eee-9fff-eeee4eee0001', 'FAMILY', NOW(), 'DOMESTIC', '00000000-0000-0000-0000-A00000000001', 'Sensus', '00000000-0000-0000-0000-B00000000001', '123456789', 'Hà Nội', 'CONT-001'),
       ('CUST-002', '456 Đường XYZ, TP.HCM', 'TRAN THI B', '987654321', 'TP.HCM', NOW(), 'customer2@example.com', 'FORM-TEST-002', 'FN-002', 2, true, false, 'Trần Thị B', 1, 'CASH', '0123456789', 10, '5e6f7081-4000-4eee-9fff-eeee4eee0001', 'FAMILY', NOW(), 'DOMESTIC', '00000000-0000-0000-0000-A00000000002', 'Woltek', '00000000-0000-0000-0000-B00000000001', '987654321', 'TP.HCM', 'CONT-002'),
       ('CUST-003', '789 Đường LMN, Đà Nẵng', 'LE VAN C', '456789123', 'Đà Nẵng', NOW(), 'customer3@example.com', 'FORM-TEST-003', 'FN-003', 3, true, false, 'Lê Văn C', 1, 'CASH', '0900000000', 10, '5e6f7081-4000-4eee-9fff-eeee4eee0001', 'FAMILY', NOW(), 'DOMESTIC', '00000000-0000-0000-0000-A00000000003', 'Flodis', '00000000-0000-0000-0000-B00000000001', '456789123', 'Đà Nẵng', 'CONT-003');

-- usage_history
INSERT INTO public.usage_history (customer_id, meter_code, usages)
VALUES ('CUST-001', '00000000-0000-0000-0000-A00000000001', '[
  {
    "id": "usage-test-001",
    "recordingDate": "2024-04-01",
    "index": 1050,
    "status": "PENDING",
    "meterImageUrl": "https://images.unsplash.com/photo-1585702138250-afe07474776e"
  }
]'),
       ('CUST-002', '00000000-0000-0000-0000-A00000000002', '[
         {
           "id": "usage-test-002",
           "recordingDate": "2024-04-01",
           "index": 2210,
           "status": "PENDING",
           "meterImageUrl": "https://images.unsplash.com/photo-1590496793907-4e96395b0c79"
         }
       ]'),
       ('CUST-003', '00000000-0000-0000-0000-A00000000003', '[
         {
           "id": "usage-test-003",
           "recordingDate": "2024-04-01",
           "index": 3345,
           "status": "PENDING",
           "meterImageUrl": "https://images.unsplash.com/photo-1610492470714-539031eb09d2"
         }
       ]');

