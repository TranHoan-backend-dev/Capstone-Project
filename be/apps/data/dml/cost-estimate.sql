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
