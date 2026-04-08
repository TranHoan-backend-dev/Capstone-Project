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

insert into public.water_usage_contract (contract_id, created_at, updated_at, customer_customer_id, form_code,
                                         form_number, representative, appendix)
values ('CTR-2024-0019', current_timestamp, current_timestamp, null, '80000001019', '20240019', '[
  {
    "name": "Phạm Thị Mai",
    "position": "Chủ hộ"
  }
]'::jsonb, null),
       ('CTR-2024-0020', current_timestamp, current_timestamp, null, '80000001020', '20240020', '[
         {
           "name": "Hoàng Văn Dũng",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0021', current_timestamp, current_timestamp, null, '80000001021', '20240021', '[
         {
           "name": "Nguyễn Thị Hoa",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0022', current_timestamp, current_timestamp, null, '80000001022', '20240022', '[
         {
           "name": "Trần Văn Thành",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0025', current_timestamp, current_timestamp, null, '80000001025', '20240025', '[
         {
           "name": "Đặng Thị B",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0028', current_timestamp, current_timestamp, null, '80000001028', '20240028', '[
         {
           "name": "Trần Văn K",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0029', current_timestamp, current_timestamp, null, '80000001029', '20240029', '[
         {
           "name": "Nguyễn Thị Tới",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0030', current_timestamp, current_timestamp, null, '80000001030', '20240030', '[
         {
           "name": "Lê Văn Thắng",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0031', current_timestamp, current_timestamp, null, '80000001031', '20240031', '[
         {
           "name": "Trần Thị Tuyết",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0032', current_timestamp, current_timestamp, null, '80000001032', '20240032', '[
         {
           "name": "Phạm Văn Hùng",
           "position": "Giám đốc"
         }
       ]'::jsonb, null),
       ('CTR-2024-0033', current_timestamp, current_timestamp, null, '80000001033', '20240033', '[
         {
           "name": "Hoàng Thị Kim",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0034', current_timestamp, current_timestamp, null, '80000001034', '20240034', '[
         {
           "name": "Đỗ Văn Cường",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0035', current_timestamp, current_timestamp, null, '80000001035', '20240035', '[
         {
           "name": "Bùi Thị Ngọc",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0036', current_timestamp, current_timestamp, null, '80000001036', '20240036', '[
         {
           "name": "Võ Văn Thành",
           "position": "Giám đốc"
         }
       ]'::jsonb, null),
       ('CTR-2024-0037', current_timestamp, current_timestamp, null, '80000001037', '20240037', '[
         {
           "name": "Đặng Thị Hồng",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null),
       ('CTR-2024-0038', current_timestamp, current_timestamp, null, '80000001038', '20240038', '[
         {
           "name": "Phan Văn Minh",
           "position": "Chủ hộ"
         }
       ]'::jsonb, null);

INSERT INTO public.customer (customer_id, address, bank_account_name, bank_account_number,
                             bank_account_provider_location,
                             budget_relationship_code, citizen_identification_number, citizen_identification_provide_at,
                             created_at, email, form_code, form_number, household_registration_number, is_active,
                             is_big_customer, name, number_of_households, payment_method, phone_number,
                             protect_environment_fee, roadmap_id, type, updated_at, usage_target, water_meter_id,
                             water_meter_type, water_price_id)
VALUES ('C-1022', '404 Võ Nguyên Giáp, Nam Định', 'TRAN VAN THANH', '190312345699', 'Sacombank Nam Định',
        'QH1022', '079090000022', '2020-02-07', current_timestamp, 'thanh.tv@gmail.com', '80000001022', '20240022',
        1254321, true, false, 'Trần Văn Thành', 2, 'BANK_TRANSFER', '0901234588', 50000,
        '5e6f7081-4000-4eee-9fff-eeee4eee0003', 'FAMILY', current_timestamp, 'DOMESTIC', 'METER-022', 'MECHANICAL',
        '00000000-0000-0000-0000-B00000000001'),
       ('C-1028', '1010 Hàng Thao, Nam Định', 'TRAN VAN K', '190312345705', 'VPBank Nam Định',
        'QH1028', '079090000028', '2020-03-05', current_timestamp, 'k.tv@gmail.com', '80000001028', '20240028',
        1054322, true, false, 'Trần Văn K', 3, 'BANK_TRANSFER', '0901234594', 50000,
        '5e6f7081-4000-4eee-9fff-eeee4eee0003', 'FAMILY', current_timestamp, 'DOMESTIC', 'METER-028', 'MECHANICAL',
        '00000000-0000-0000-0000-B00000000001'),
       ('C-1029', '11 Nguyễn Du, Nam Định', 'NGUYEN THI TOI', '190312345706', 'Agribank Nam Định', 'QH1029',
        '079090000029', '2020-04-01', current_timestamp, 'toi.nt@gmail.com', '80000001029', '20240029', 101, true,
        false, 'Nguyễn Thị Tới', 4, 'BANK_TRANSFER', '0901234601', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-029', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1030', '22 Trần Phú, Nam Định', 'LE VAN THANG', '190312345707', 'BIDV Nam Định', 'QH1030', '079090000030',
        '2020-04-02', current_timestamp, 'thang.lv@gmail.com', '80000001030', '20240030', 102, true, false,
        'Lê Văn Thắng', 3, 'BANK_TRANSFER', '0901234602', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001', 'FAMILY',
        current_timestamp, 'DOMESTIC', 'METER-030', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1031', '33 Lý Thường Kiệt, Nam Định', 'TRAN THI TUYET', '190312345708', 'Vietcombank Nam Định', 'QH1031',
        '079090000031', '2020-04-03', current_timestamp, 'tuyet.tt@gmail.com', '80000001031', '20240031', 103, true,
        false, 'Trần Thị Tuyết', 5, 'BANK_TRANSFER', '0901234603', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-031', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1032', '44 Hàng Thao, Nam Định', 'PHAM VAN HUNG', '190312345709', 'Techcombank Nam Định', 'QH1032',
        '079090000032', '2020-04-04', current_timestamp, 'hung.pv@gmail.com', '80000001032', '20240032', 104, true,
        false, 'Phạm Văn Hùng', 2, 'BANK_TRANSFER', '0901234604', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'COMPANY', current_timestamp, 'COMMERCIAL', 'METER-032', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1033', '55 Quang Trung, Nam Định', 'HOANG THI KIM', '190312345710', 'VPBank Nam Định', 'QH1033',
        '079090000033', '2020-04-05', current_timestamp, 'kim.ht@gmail.com', '80000001033', '20240033', 105, true,
        false, 'Hoàng Thị Kim', 4, 'BANK_TRANSFER', '0901234605', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-033', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1034', '66 Lê Hồng Phong, Nam Định', 'DO VAN CUONG', '190312345711', 'ACB Nam Định', 'QH1034',
        '079090000034', '2020-04-06', current_timestamp, 'cuong.dv@gmail.com', '80000001034', '20240034', 106, true,
        false, 'Đỗ Văn Cường', 3, 'BANK_TRANSFER', '0901234606', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-034', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1035', '77 Hùng Vương, Nam Định', 'BUI THI NGOC', '190312345712', 'Sacombank Nam Định', 'QH1035',
        '079090000035', '2020-04-07', current_timestamp, 'ngoc.bt@gmail.com', '80000001035', '20240035', 107, true,
        false, 'Bùi Thị Ngọc', 5, 'BANK_TRANSFER', '0901234607', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0001',
        'FAMILY', current_timestamp, 'DOMESTIC', 'METER-035', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1036', '88 Võ Nguyên Giáp, Nam Định', 'VO VAN THANH', '190312345713', 'Maritime Bank', 'QH1036',
        '079090000036', '2020-05-01', current_timestamp, 'thanh.vv@gmail.com', '80000001036', '20240036', 108, true,
        false, 'Võ Văn Thành', 2, 'BANK_TRANSFER', '0901234608', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0002',
        'COMPANY', current_timestamp, 'COMMERCIAL', 'METER-036', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1037', '99 Trường Chinh, Nam Định', 'DANG THI HONG', '190312345714', 'SeABank', 'QH1037', '079090000037',
        '2020-05-02', current_timestamp, 'hong.dt@gmail.com', '80000001037', '20240037', 109, true, false,
        'Đặng Thị Hồng', 4, 'BANK_TRANSFER', '0901234609', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0002', 'FAMILY',
        current_timestamp, 'DOMESTIC', 'METER-037', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001'),
       ('C-1038', '111 Điện Biên, Nam Định', 'PHAN VAN MINH', '190312345715', 'TPBank', 'QH1038', '079090000038',
        '2020-05-03', current_timestamp, 'minh.pv@gmail.com', '80000001038', '20240038', 110, true, false,
        'Phan Văn Minh', 3, 'BANK_TRANSFER', '0901234610', 50000, '5e6f7081-4000-4eee-9fff-eeee4eee0002', 'FAMILY',
        current_timestamp, 'DOMESTIC', 'METER-038', 'MECHANICAL', '00000000-0000-0000-0000-B00000000001');

UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1029'
WHERE form_code = '80000001029';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1030'
WHERE form_code = '80000001030';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1031'
WHERE form_code = '80000001031';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1032'
WHERE form_code = '80000001032';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1033'
WHERE form_code = '80000001033';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1034'
WHERE form_code = '80000001034';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1035'
WHERE form_code = '80000001035';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1036'
WHERE form_code = '80000001036';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1037'
WHERE form_code = '80000001037';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1038'
WHERE form_code = '80000001038';


UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1022'
WHERE form_code = '80000001022';
UPDATE public.water_usage_contract
SET customer_customer_id = 'C-1028'
WHERE form_code = '80000001028';
