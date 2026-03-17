-- Extension unaccent
CREATE EXTENSION IF NOT EXISTS unaccent;

-- DML for customer table (15 records)
INSERT INTO public.customer (
    customer_id, bank_account_name, bank_account_number, bank_account_provider_location,
    budget_relationship_code, cancel_reason, citizen_identification_number,
    citizen_identification_provide_at, connection_point,
    created_at, deduction_period, email, fix_rate, household_registration_number,
    installation_fee, installation_form_id, is_active, is_big_customer, is_free,
    is_sale, m3sale, monthly_rent, name, number_of_households, passport_code,
    payment_method, phone_number, protect_environment_fee,
    type, updated_at, usage_target, water_meter_id, water_meter_type, water_price_id
) VALUES
('C001', 'NGUYEN VAN AN', '1234567890', 'Vietcombank Ha Noi', 'QH001', NULL, '001090123456', 'Ha Noi', 'P001', CURRENT_TIMESTAMP, 'Q1', 'an.nv@gmail.com', 'N', 12345, 500000, 'FORM001', true, false, false, false, '0', 20000, 'Nguyễn Văn An', 4, NULL, 'CASH', '0123456789', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M001', 'MECHANICAL', 'P_RES'),
('C002', 'TRAN THI BINH', '0987654321', 'BIDV Da Nang', 'QH002', NULL, '001090123457', 'Da Nang', 'P002', CURRENT_TIMESTAMP, 'Q1', 'binh.tt@gmail.com', 'N', 12346, 550000, 'FORM002', true, false, false, false, '0', 20000, 'Trần Thị Bình', 3, NULL, 'BANK_TRANSFER', '0987654321', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M002', 'ELECTRONIC', 'P_RES'),
('C003', 'LE VAN CUONG', '1122334455', 'Agribank TP HCM', 'QH003', NULL, '001090123458', 'TP HCM', 'P003', CURRENT_TIMESTAMP, 'Q2', 'cuong.lv@gmail.com', 'Y', 12347, 450000, 'FORM003', true, true, false, false, '10', 0, 'Lê Văn Cường', 5, NULL, 'CASH', '0912345678', 100000, 'COMMERCIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M003', 'MECHANICAL', 'P_COM'),
('C004', 'PHAM THU DUNG', '5566778899', 'Vietinbank Hai Phong', 'QH004', NULL, '001090123459', 'Hai Phong', 'P004', CURRENT_TIMESTAMP, 'Q2', 'dung.pt@gmail.com', 'N', 12348, 600000, 'FORM004', true, false, false, false, '0', 20000, 'Phạm Thu Dung', 2, NULL, 'BANK_TRANSFER', '0901234567', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M004', 'ELECTRONIC', 'P_RES'),
('C005', 'HOANG VAN EM', '9988776655', 'Techcombank Can Tho', 'QH005', NULL, '001090123460', 'Can Tho', 'P005', CURRENT_TIMESTAMP, 'Q3', 'em.hv@gmail.com', 'N', 12349, 700000, 'FORM005', true, false, false, false, '0', 20000, 'Hoàng Văn Em', 6, NULL, 'CASH', '0888777666', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M005', 'MECHANICAL', 'P_RES'),
('C006', 'VU THI PHUONG', '1357246800', 'MB Bank Dong Nai', 'QH006', NULL, '001090123461', 'Dong Nai', 'P006', CURRENT_TIMESTAMP, 'Q3', 'phuong.vt@gmail.com', 'N', 12350, 480000, 'FORM006', true, false, false, false, '0', 20000, 'Vũ Thị Phương', 4, NULL, 'BANK_TRANSFER', '0955555444', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M006', 'ELECTRONIC', 'P_RES'),
('C007', 'DANG VAN GIANG', '2468135790', 'Sacombank Binh Duong', 'QH007', NULL, '001090123462', 'Binh Duong', 'P007', CURRENT_TIMESTAMP, 'Q4', 'giang.dv@gmail.com', 'Y', 12351, 520000, 'FORM007', true, true, false, false, '20', 0, 'Đặng Văn Giang', 10, NULL, 'CASH', '0944444333', 150000, 'INDUSTRIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M007', 'MECHANICAL', 'P_IND'),
('C008', 'BUI THI HOA', '1010101010', 'VIB Ha Noi', 'QH008', NULL, '001090123463', 'Ha Noi', 'P008', CURRENT_TIMESTAMP, 'Q4', 'hoa.bt@gmail.com', 'N', 12352, 650000, 'FORM008', true, false, false, false, '0', 20000, 'Bùi Thị Hoa', 3, NULL, 'BANK_TRANSFER', '0933333222', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M008', 'ELECTRONIC', 'P_RES'),
('C009', 'NONG VAN KIEN', '2020202020', 'SHB Thai Nguyen', 'QH009', NULL, '001090123464', 'Thai Nguyen', 'P009', CURRENT_TIMESTAMP, 'Q1', 'kien.nv@gmail.com', 'N', 12353, 580000, 'FORM009', true, false, false, false, '0', 20000, 'Nông Văn Kiên', 4, NULL, 'CASH', '0922222111', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M009', 'MECHANICAL', 'P_RES'),
('C010', 'LY THI LAN', '3030303030', 'TPBank Lao Cai', 'QH010', NULL, '001090123465', 'Lao Cai', 'P010', CURRENT_TIMESTAMP, 'Q1', 'lan.lt@gmail.com', 'N', 12354, 490000, 'FORM010', true, false, false, false, '0', 20000, 'Lý Thị Lan', 2, NULL, 'BANK_TRANSFER', '0911111000', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M010', 'ELECTRONIC', 'P_RES'),
('C011', 'MA VAN MINH', '4040404040', 'ACB Phu Quoc', 'QH011', NULL, '001090123466', 'Kien Giang', 'P011', CURRENT_TIMESTAMP, 'Q2', 'minh.mv@gmail.com', 'Y', 12355, 1200000, 'FORM011', true, true, false, false, '50', 100000, 'Ma Văn Minh', 20, NULL, 'CASH', '0912121212', 300000, 'COMMERCIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M011', 'ELECTRONIC', 'P_COM'),
('C012', 'CHU THI NGA', '5050505050', 'Eximbank Nha Trang', 'QH012', NULL, '001090123467', 'Khanh Hoa', 'P012', CURRENT_TIMESTAMP, 'Q2', 'nga.ct@gmail.com', 'N', 12356, 460000, 'FORM012', true, false, false, false, '0', 20000, 'Chu Thị Nga', 3, NULL, 'BANK_TRANSFER', '0923232323', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M012', 'MECHANICAL', 'P_RES'),
('C013', 'DIEP VAN PHUC', '6060606060', 'HDBank Da Lat', 'QH013', NULL, '001090123468', 'Lam Dong', 'P013', CURRENT_TIMESTAMP, 'Q3', 'phuc.dv@gmail.com', 'N', 12357, 510000, 'FORM013', true, false, false, false, '0', 20000, 'Diệp Văn Phúc', 4, NULL, 'CASH', '0934343434', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M013', 'ELECTRONIC', 'P_RES'),
('C014', 'DAO THI QUYEN', '7070707070', 'SeABank Ha Noi', 'QH014', NULL, '001090123469', 'Ha Noi', 'P014', CURRENT_TIMESTAMP, 'Q3', 'quyen.dt@gmail.com', 'N', 12358, 530000, 'FORM014', true, false, false, false, '0', 20000, 'Đào Thị Quyên', 3, NULL, 'BANK_TRANSFER', '0945454545', 50000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M014', 'MECHANICAL', 'P_RES'),
('C015', 'TANG VAN SON', '8080808080', 'VPBank Da Nang', 'QH015', NULL, '001090123470', 'Da Nang', 'P015', CURRENT_TIMESTAMP, 'Q4', 'son.tv@gmail.com', 'Y', 12359, 680000, 'FORM015', true, false, false, false, '5', 25000, 'Tăng Văn Sơn', 5, NULL, 'CASH', '0956565656', 70000, 'RESIDENTIAL', CURRENT_TIMESTAMP, 'DOMESTIC', 'M015', 'ELECTRONIC', 'P_RES');

-- DML for bill table (15 records)
INSERT INTO public.bill (bill_name, export_address, note, customer_customer_id) VALUES
('Hóa đơn tháng 03/2024 - C001', 'Số 1, Phố Huế, Hoàn Kiếm, Hà Nội', 'Thanh toán đúng hạn', 'C001'),
('Hóa đơn tháng 03/2024 - C002', 'Số 2, Phan Chu Trinh, Hải Châu, Đà Nẵng', NULL, 'C002'),
('Hóa đơn tháng 03/2024 - C003', 'Số 3, Lê Lợi, Quận 1, TP HCM', 'Khách hàng lớn', 'C003'),
('Hóa đơn tháng 03/2024 - C004', 'Số 4, Lạch Tray, Ngô Quyền, Hải Phòng', NULL, 'C004'),
('Hóa đơn tháng 03/2024 - C005', 'Số 5, Hòa Bình, Ninh Kiều, Cần Thơ', 'Gia đình đông người', 'C005'),
('Hóa đơn tháng 03/2024 - C006', 'Số 6, CMT8, Biên Hòa, Đồng Nai', NULL, 'C006'),
('Hóa đơn tháng 03/2024 - C007', 'Số 7, Đại Lộ Bình Dương, Thủ Dầu Một, Bình Dương', 'Khu công nghiệp', 'C007'),
('Hóa đơn tháng 03/2024 - C008', 'Số 8, Nguyễn Trãi, Thanh Xuân, Hà Nội', NULL, 'C008'),
('Hóa đơn tháng 03/2024 - C009', 'Số 9, Lương Ngọc Quyến, TP Thái Nguyên', 'Vùng cao', 'C009'),
('Hóa đơn tháng 03/2024 - C010', 'Số 10, Hoàng Liên, TP Lào Cai', NULL, 'C010'),
('Hóa đơn tháng 03/2024 - C011', 'Số 11, Trần Hưng Đạo, Phú Quốc, Kiên Giang', 'Khách sạn', 'C011'),
('Hóa đơn tháng 03/2024 - C012', 'Số 12, Trần Phú, Nha Trang, Khánh Hòa', NULL, 'C012'),
('Hóa đơn tháng 03/2024 - C013', 'Số 13, Phan Đình Phùng, Đà Lạt, Lâm Đồng', 'Nghỉ dưỡng', 'C013'),
('Hóa đơn tháng 03/2024 - C014', 'Số 14, Cầu Giấy, Hà Nội', NULL, 'C014'),
('Hóa đơn tháng 03/2024 - C015', 'Số 15, Ngô Quyền, Sơn Trà, Đà Nẵng', 'Ven biển', 'C015');

-- DML for installation_contract table (15 records)
INSERT INTO public.installation_contract (contract_id, created_at, installation_form_id, updated_at, customer_customer_id) VALUES
('HDLD_001', CURRENT_TIMESTAMP, 'FORM001', CURRENT_TIMESTAMP, 'C001'),
('HDLD_002', CURRENT_TIMESTAMP, 'FORM002', CURRENT_TIMESTAMP, 'C002'),
('HDLD_003', CURRENT_TIMESTAMP, 'FORM003', CURRENT_TIMESTAMP, 'C003'),
('HDLD_004', CURRENT_TIMESTAMP, 'FORM004', CURRENT_TIMESTAMP, 'C004'),
('HDLD_005', CURRENT_TIMESTAMP, 'FORM005', CURRENT_TIMESTAMP, 'C005'),
('HDLD_006', CURRENT_TIMESTAMP, 'FORM006', CURRENT_TIMESTAMP, 'C006'),
('HDLD_007', CURRENT_TIMESTAMP, 'FORM007', CURRENT_TIMESTAMP, 'C007'),
('HDLD_008', CURRENT_TIMESTAMP, 'FORM008', CURRENT_TIMESTAMP, 'C008'),
('HDLD_009', CURRENT_TIMESTAMP, 'FORM009', CURRENT_TIMESTAMP, 'C009'),
('HDLD_010', CURRENT_TIMESTAMP, 'FORM010', CURRENT_TIMESTAMP, 'C010'),
('HDLD_011', CURRENT_TIMESTAMP, 'FORM011', CURRENT_TIMESTAMP, 'C011'),
('HDLD_012', CURRENT_TIMESTAMP, 'FORM012', CURRENT_TIMESTAMP, 'C012'),
('HDLD_013', CURRENT_TIMESTAMP, 'FORM013', CURRENT_TIMESTAMP, 'C013'),
('HDLD_014', CURRENT_TIMESTAMP, 'FORM014', CURRENT_TIMESTAMP, 'C014'),
('HDLD_015', CURRENT_TIMESTAMP, 'FORM015', CURRENT_TIMESTAMP, 'C015');

-- DML for water_usage_contract table (15 records)
INSERT INTO public.water_usage_contract (contract_id, created_at, updated_at, customer_customer_id, installation_form_id, representative) VALUES
('HDN_001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C001', 'FORM001', '[{"name": "Nguyên Văn An", "position": "Chủ hộ"}]'::jsonb),
('HDN_002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C002', 'FORM002', '[{"name": "Trần Thị Bình", "position": "Chủ hộ"}]'::jsonb),
('HDN_003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C003', 'FORM003', '[{"name": "Lê Văn Cường", "position": "Giám đốc"}]'::jsonb),
('HDN_004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C004', 'FORM004', '[{"name": "Phạm Thu Dung", "position": "Chủ hộ"}]'::jsonb),
('HDN_005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C005', 'FORM005', '[{"name": "Hoàng Văn Em", "position": "Chủ hộ"}]'::jsonb),
('HDN_006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C006', 'FORM006', '[{"name": "Vũ Thị Phương", "position": "Chủ hộ"}]'::jsonb),
('HDN_007', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C007', 'FORM007', '[{"name": "Đặng Văn Giang", "position": "Quản lý"}]'::jsonb),
('HDN_008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C008', 'FORM008', '[{"name": "Bùi Thị Hoa", "position": "Chủ hộ"}]'::jsonb),
('HDN_009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C009', 'FORM009', '[{"name": "Nông Văn Kiên", "position": "Chủ hộ"}]'::jsonb),
('HDN_010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C010', 'FORM010', '[{"name": "Lý Thị Lan", "position": "Chủ hộ"}]'::jsonb),
('HDN_011', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C011', 'FORM011', '[{"name": "Ma Văn Minh", "position": "Giám đốc"}]'::jsonb),
('HDN_012', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C012', 'FORM012', '[{"name": "Chu Thị Nga", "position": "Chủ hộ"}]'::jsonb),
('HDN_013', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C013', 'FORM013', '[{"name": "Diệp Văn Phúc", "position": "Chủ hộ"}]'::jsonb),
('HDN_014', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C014', 'FORM014', '[{"name": "Đào Thị Quyên", "position": "Chủ hộ"}]'::jsonb),
('HDN_015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'C015', 'FORM015', '[{"name": "Tăng Văn Sơn", "position": "Chủ hộ"}]'::jsonb);
