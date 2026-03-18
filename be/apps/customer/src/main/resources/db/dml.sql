-- Extension unaccent
create extension if not exists unaccent;

-- DML for customer table (15 records)
insert into public.customer (
    customer_id,
    bank_account_name,
    bank_account_number,
    bank_account_provider_location,
    budget_relationship_code,
    cancel_reason,
    citizen_identification_number,
    citizen_identification_provide_at,
    connection_point,
    created_at,
    deduction_period,
    email,
    fix_rate,
    household_registration_number,
    installation_fee,
    installation_form_id,
    is_active,
    is_big_customer,
    is_free,
    is_sale,
    m3sale,
    monthly_rent,
    name,
    number_of_households,
    passport_code,
    payment_method,
    phone_number,
    protect_environment_fee,
    type,
    updated_at,
    usage_target,
    water_meter_id,
    water_meter_type,
    water_price_id
)
values
    ('C001', 'NGUYEN VAN AN', '1234567890', 'Vietcombank Ha Noi', 'QH001', null, '001090123456', 'Ha Noi', 'P001', current_timestamp, 'Q1', 'an.nv@gmail.com', 'N', 12345, 500000, 'FORM001', true, false, false, false, '0', 20000, 'Nguyễn Văn An', 4, null, 'CASH', '0123456789', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M001', 'MECHANICAL', 'P_RES'),
    ('C002', 'TRAN THI BINH', '0987654321', 'BIDV Da Nang', 'QH002', null, '001090123457', 'Da Nang', 'P002', current_timestamp, 'Q1', 'binh.tt@gmail.com', 'N', 12346, 550000, 'FORM002', true, false, false, false, '0', 20000, 'Trần Thị Bình', 3, null, 'BANK_TRANSFER', '0987654321', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M002', 'ELECTRONIC', 'P_RES'),
    ('C003', 'LE VAN CUONG', '1122334455', 'Agribank TP HCM', 'QH003', null, '001090123458', 'TP HCM', 'P003', current_timestamp, 'Q2', 'cuong.lv@gmail.com', 'Y', 12347, 450000, 'FORM003', true, true, false, false, '10', 0, 'Lê Văn Cường', 5, null, 'CASH', '0912345678', 100000, 'COMMERCIAL', current_timestamp, 'DOMESTIC', 'M003', 'MECHANICAL', 'P_COM'),
    ('C004', 'PHAM THU DUNG', '5566778899', 'Vietinbank Hai Phong', 'QH004', null, '001090123459', 'Hai Phong', 'P004', current_timestamp, 'Q2', 'dung.pt@gmail.com', 'N', 12348, 600000, 'FORM004', true, false, false, false, '0', 20000, 'Phạm Thu Dung', 2, null, 'BANK_TRANSFER', '0901234567', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M004', 'ELECTRONIC', 'P_RES'),
    ('C005', 'HOANG VAN EM', '9988776655', 'Techcombank Can Tho', 'QH005', null, '001090123460', 'Can Tho', 'P005', current_timestamp, 'Q3', 'em.hv@gmail.com', 'N', 12349, 700000, 'FORM005', true, false, false, false, '0', 20000, 'Hoàng Văn Em', 6, null, 'CASH', '0888777666', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M005', 'MECHANICAL', 'P_RES'),
    ('C006', 'VU THI PHUONG', '1357246800', 'MB Bank Dong Nai', 'QH006', null, '001090123461', 'Dong Nai', 'P006', current_timestamp, 'Q3', 'phuong.vt@gmail.com', 'N', 12350, 480000, 'FORM006', true, false, false, false, '0', 20000, 'Vũ Thị Phương', 4, null, 'BANK_TRANSFER', '0955555444', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M006', 'ELECTRONIC', 'P_RES'),
    ('C007', 'DANG VAN GIANG', '2468135790', 'Sacombank Binh Duong', 'QH007', null, '001090123462', 'Binh Duong', 'P007', current_timestamp, 'Q4', 'giang.dv@gmail.com', 'Y', 12351, 520000, 'FORM007', true, true, false, false, '20', 0, 'Đặng Văn Giang', 10, null, 'CASH', '0944444333', 150000, 'INDUSTRIAL', current_timestamp, 'DOMESTIC', 'M007', 'MECHANICAL', 'P_IND'),
    ('C008', 'BUI THI HOA', '1010101010', 'VIB Ha Noi', 'QH008', null, '001090123463', 'Ha Noi', 'P008', current_timestamp, 'Q4', 'hoa.bt@gmail.com', 'N', 12352, 650000, 'FORM008', true, false, false, false, '0', 20000, 'Bùi Thị Hoa', 3, null, 'BANK_TRANSFER', '0933333222', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M008', 'ELECTRONIC', 'P_RES'),
    ('C009', 'NONG VAN KIEN', '2020202020', 'SHB Thai Nguyen', 'QH009', null, '001090123464', 'Thai Nguyen', 'P009', current_timestamp, 'Q1', 'kien.nv@gmail.com', 'N', 12353, 580000, 'FORM009', true, false, false, false, '0', 20000, 'Nông Văn Kiên', 4, null, 'CASH', '0922222111', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M009', 'MECHANICAL', 'P_RES'),
    ('C010', 'LY THI LAN', '3030303030', 'TPBank Lao Cai', 'QH010', null, '001090123465', 'Lao Cai', 'P010', current_timestamp, 'Q1', 'lan.lt@gmail.com', 'N', 12354, 490000, 'FORM010', true, false, false, false, '0', 20000, 'Lý Thị Lan', 2, null, 'BANK_TRANSFER', '0911111000', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M010', 'ELECTRONIC', 'P_RES'),
    ('C011', 'MA VAN MINH', '4040404040', 'ACB Phu Quoc', 'QH011', null, '001090123466', 'Kien Giang', 'P011', current_timestamp, 'Q2', 'minh.mv@gmail.com', 'Y', 12355, 1200000, 'FORM011', true, true, false, false, '50', 100000, 'Ma Văn Minh', 20, null, 'CASH', '0912121212', 300000, 'COMMERCIAL', current_timestamp, 'DOMESTIC', 'M011', 'ELECTRONIC', 'P_COM'),
    ('C012', 'CHU THI NGA', '5050505050', 'Eximbank Nha Trang', 'QH012', null, '001090123467', 'Khanh Hoa', 'P012', current_timestamp, 'Q2', 'nga.ct@gmail.com', 'N', 12356, 460000, 'FORM012', true, false, false, false, '0', 20000, 'Chu Thị Nga', 3, null, 'BANK_TRANSFER', '0923232323', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M012', 'MECHANICAL', 'P_RES'),
    ('C013', 'DIEP VAN PHUC', '6060606060', 'HDBank Da Lat', 'QH013', null, '001090123468', 'Lam Dong', 'P013', current_timestamp, 'Q3', 'phuc.dv@gmail.com', 'N', 12357, 510000, 'FORM013', true, false, false, false, '0', 20000, 'Diệp Văn Phúc', 4, null, 'CASH', '0934343434', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M013', 'ELECTRONIC', 'P_RES'),
    ('C014', 'DAO THI QUYEN', '7070707070', 'SeABank Ha Noi', 'QH014', null, '001090123469', 'Ha Noi', 'P014', current_timestamp, 'Q3', 'quyen.dt@gmail.com', 'N', 12358, 530000, 'FORM014', true, false, false, false, '0', 20000, 'Đào Thị Quyên', 3, null, 'BANK_TRANSFER', '0945454545', 50000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M014', 'MECHANICAL', 'P_RES'),
    ('C015', 'TANG VAN SON', '8080808080', 'VPBank Da Nang', 'QH015', null, '001090123470', 'Da Nang', 'P015', current_timestamp, 'Q4', 'son.tv@gmail.com', 'Y', 12359, 680000, 'FORM015', true, false, false, false, '5', 25000, 'Tăng Văn Sơn', 5, null, 'CASH', '0956565656', 70000, 'RESIDENTIAL', current_timestamp, 'DOMESTIC', 'M015', 'ELECTRONIC', 'P_RES');

-- DML for bill table (15 records)
insert into public.bill (bill_name, export_address, note, customer_customer_id)
values
    ('Hóa đơn tháng 03/2024 - C001', 'Số 1, Phố Huế, Hoàn Kiếm, Hà Nội', 'Thanh toán đúng hạn', 'C001'),
    ('Hóa đơn tháng 03/2024 - C002', 'Số 2, Phan Chu Trinh, Hải Châu, Đà Nẵng', null, 'C002'),
    ('Hóa đơn tháng 03/2024 - C003', 'Số 3, Lê Lợi, Quận 1, TP HCM', 'Khách hàng lớn', 'C003'),
    ('Hóa đơn tháng 03/2024 - C004', 'Số 4, Lạch Tray, Ngô Quyền, Hải Phòng', null, 'C004'),
    ('Hóa đơn tháng 03/2024 - C005', 'Số 5, Hòa Bình, Ninh Kiều, Cần Thơ', 'Gia đình đông người', 'C005'),
    ('Hóa đơn tháng 03/2024 - C006', 'Số 6, CMT8, Biên Hòa, Đồng Nai', null, 'C006'),
    ('Hóa đơn tháng 03/2024 - C007', 'Số 7, Đại Lộ Bình Dương, Thủ Dầu Một, Bình Dương', 'Khu công nghiệp', 'C007'),
    ('Hóa đơn tháng 03/2024 - C008', 'Số 8, Nguyễn Trãi, Thanh Xuân, Hà Nội', null, 'C008'),
    ('Hóa đơn tháng 03/2024 - C009', 'Số 9, Lương Ngọc Quyến, TP Thái Nguyên', 'Vùng cao', 'C009'),
    ('Hóa đơn tháng 03/2024 - C010', 'Số 10, Hoàng Liên, TP Lào Cai', null, 'C010'),
    ('Hóa đơn tháng 03/2024 - C011', 'Số 11, Trần Hưng Đạo, Phú Quốc, Kiên Giang', 'Khách sạn', 'C011'),
    ('Hóa đơn tháng 03/2024 - C012', 'Số 12, Trần Phú, Nha Trang, Khánh Hòa', null, 'C012'),
    ('Hóa đơn tháng 03/2024 - C013', 'Số 13, Phan Đình Phùng, Đà Lạt, Lâm Đồng', 'Nghỉ dưỡng', 'C013'),
    ('Hóa đơn tháng 03/2024 - C014', 'Số 14, Cầu Giấy, Hà Nội', null, 'C014'),
    ('Hóa đơn tháng 03/2024 - C015', 'Số 15, Ngô Quyền, Sơn Trà, Đà Nẵng', 'Ven biển', 'C015');

-- DML for installation_contract table (15 records)
insert into public.installation_contract (contract_id, created_at, installation_form_id, updated_at, customer_customer_id)
values
    ('HDLD_001', current_timestamp, 'FORM001', current_timestamp, 'C001'),
    ('HDLD_002', current_timestamp, 'FORM002', current_timestamp, 'C002'),
    ('HDLD_003', current_timestamp, 'FORM003', current_timestamp, 'C003'),
    ('HDLD_004', current_timestamp, 'FORM004', current_timestamp, 'C004'),
    ('HDLD_005', current_timestamp, 'FORM005', current_timestamp, 'C005'),
    ('HDLD_006', current_timestamp, 'FORM006', current_timestamp, 'C006'),
    ('HDLD_007', current_timestamp, 'FORM007', current_timestamp, 'C007'),
    ('HDLD_008', current_timestamp, 'FORM008', current_timestamp, 'C008'),
    ('HDLD_009', current_timestamp, 'FORM009', current_timestamp, 'C009'),
    ('HDLD_010', current_timestamp, 'FORM010', current_timestamp, 'C010'),
    ('HDLD_011', current_timestamp, 'FORM011', current_timestamp, 'C011'),
    ('HDLD_012', current_timestamp, 'FORM012', current_timestamp, 'C012'),
    ('HDLD_013', current_timestamp, 'FORM013', current_timestamp, 'C013'),
    ('HDLD_014', current_timestamp, 'FORM014', current_timestamp, 'C014'),
    ('HDLD_015', current_timestamp, 'FORM015', current_timestamp, 'C015');

-- DML for water_usage_contract table (15 records)
insert into public.water_usage_contract (contract_id, created_at, updated_at, customer_customer_id, installation_form_id, representative)
values
    ('HDN_001', current_timestamp, current_timestamp, 'C001', 'FORM001', '[{"name": "Nguyên Văn An", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_002', current_timestamp, current_timestamp, 'C002', 'FORM002', '[{"name": "Trần Thị Bình", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_003', current_timestamp, current_timestamp, 'C003', 'FORM003', '[{"name": "Lê Văn Cường", "position": "Giám đốc"}]'::jsonb),
    ('HDN_004', current_timestamp, current_timestamp, 'C004', 'FORM004', '[{"name": "Phạm Thu Dung", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_005', current_timestamp, current_timestamp, 'C005', 'FORM005', '[{"name": "Hoàng Văn Em", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_006', current_timestamp, current_timestamp, 'C006', 'FORM006', '[{"name": "Vũ Thị Phương", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_007', current_timestamp, current_timestamp, 'C007', 'FORM007', '[{"name": "Đặng Văn Giang", "position": "Quản lý"}]'::jsonb),
    ('HDN_008', current_timestamp, current_timestamp, 'C008', 'FORM008', '[{"name": "Bùi Thị Hoa", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_009', current_timestamp, current_timestamp, 'C009', 'FORM009', '[{"name": "Nông Văn Kiên", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_010', current_timestamp, current_timestamp, 'C010', 'FORM010', '[{"name": "Lý Thị Lan", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_011', current_timestamp, current_timestamp, 'C011', 'FORM011', '[{"name": "Ma Văn Minh", "position": "Giám đốc"}]'::jsonb),
    ('HDN_012', current_timestamp, current_timestamp, 'C012', 'FORM012', '[{"name": "Chu Thị Nga", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_013', current_timestamp, current_timestamp, 'C013', 'FORM013', '[{"name": "Diệp Văn Phúc", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_014', current_timestamp, current_timestamp, 'C014', 'FORM014', '[{"name": "Đào Thị Quyên", "position": "Chủ hộ"}]'::jsonb),
    ('HDN_015', current_timestamp, current_timestamp, 'C015', 'FORM015', '[{"name": "Tăng Văn Sơn", "position": "Chủ hộ"}]'::jsonb);
