DELETE FROM installation_form;
DELETE FROM laterals;
DELETE FROM water_supply_network;
DELETE FROM neighborhood_unit;
DELETE FROM hamlet;
DELETE FROM commune;
DELETE FROM road;
DELETE FROM settlement;
DELETE FROM construction_request;
DELETE FROM cost_estimate;
DELETE FROM roadmap;

INSERT INTO installation_form (form_code, address, bank_account_number, bank_account_provider_location,
citizen_identification_number, citizen_identification_provide_date,
citizen_identification_provide_location, created_at, created_by, customer_name,
form_number, household_registration_number, number_of_household, overall_water_meter_id,
phone_number, received_form_at, updated_at, usage_target, customer_type, handover_by,
representative, schedule_survey_at, tax_code, water_supply_network_id)
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '123 Le Loi, District 1, HCMC', '190312345678', 'Techcombank HCMC',
'079090000001', '2020-01-01', 'CA TPHCM', '2024-01-01 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Nguyen Van A', 'FORM-2024-0001', 123456, 4, 'METER-001', '0901234567', '2024-01-01 09:00:00',
'2024-01-01 10:00:00', 'DOMESTIC', 'COMPANY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '456 Nguyen Hue, District 1, HCMC', '190312345679', 'Vietcombank HCMC',
'079090000002', '2020-01-02', 'CA TPHCM', '2024-01-02 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Tran Thi B', 'FORM-2024-0002', 223456, 3, 'METER-002', '0901234568', '2024-01-02 09:00:00',
'2024-01-02 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '789 Hai Ba Trung, District 3, HCMC', '190312345680', 'ACB HCMC',
'079090000003', '2020-01-03', 'CA TPHCM', '2024-01-03 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Le Van C', 'FORM-2024-0003', 323456, 5, 'METER-003', '0901234569', '2024-01-03 09:00:00',
'2024-01-03 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '101 Dien Bien Phu, Binh Thanh, HCMC', '190312345681', 'BIDV HCMC',
'079090000004', '2020-01-04', 'CA TPHCM', '2024-01-04 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Pham Thi D', 'FORM-2024-0004', 423456, 2, 'METER-004', '0901234570', '2024-01-04 09:00:00',
'2024-01-04 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '202 Nguyen Thi Minh Khai, District 1, HCMC', '190312345682', 'VPBank HCMC',
'079090000005', '2020-01-05', 'CA TPHCM', '2024-01-05 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Hoang Thi E', 'FORM-2024-0005', 523456, 3, 'METER-005', '0901234571', '2024-01-05 09:00:00',
'2024-01-05 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '303 Cach Mang Thang Tam, District 10, HCMC', '190312345683', 'MBBank HCMC',
'079090000006', '2020-01-06', 'CA TPHCM', '2024-01-06 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Nguyen Van F', 'FORM-2024-0006', 623456, 4, 'METER-006', '0901234572', '2024-01-06 09:00:00',
'2024-01-06 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('g6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '404 Le Van Sy, Phu Nhuan, HCMC', '190312345684', 'Sacombank HCMC',
'079090000007', '2020-01-07', 'CA TPHCM', '2024-01-07 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Tran Thi G', 'FORM-2024-0007', 723456, 2, 'METER-007', '0901234573', '2024-01-07 09:00:00',
'2024-01-07 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('h7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '505 Nguyen Van Luong, Binh Thanh, HCMC', '190312345685', 'Techcombank HCMC',
'079090000008', '2020-01-08', 'CA TPHCM', '2024-01-08 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Le Van H', 'FORM-2024-0008', 823456, 5, 'METER-008', '0901234574', '2024-01-08 09:00:00',
'2024-01-08 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('i8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', '606 Hoang Van Thu, Tan Binh, HCMC', '190312345686', 'Vietinbank HCMC',
'079090000009', '2020-01-09', 'CA TPHCM', '2024-01-09 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Pham Thi I', 'FORM-2024-0009', 923456, 3, 'METER-009', '0901234575', '2024-01-09 09:00:00',
'2024-01-09 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL),
('j9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '707 Nguyen Thi Minh Khai, District 3, HCMC', '190312345687', 'BIDV HCMC',
'079090000010', '2020-01-10', 'CA TPHCM', '2024-01-10 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
'Nguyen Van J', 'FORM-2024-0010', 1023456, 4, 'METER-010', '0901234576', '2024-01-10 09:00:00',
'2024-01-10 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
"contract": "PROCESSING",
"estimate": "PROCESSING",
"construction": "PROCESSING",
"registration": "PROCESSING"
}', NULL, NULL);

INSERT INTO settlement (settlement_id, address, connection_fee, created_at,
job_content, note, registration_at, updated_at)
VALUES ('6f708192-5000-4aaa-9bbb-ffff4fff0001', 'Address 1', 1500000, now(), 'Job 1', 'Note 1', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0002', 'Address 2', 1600000, now(), 'Job 2', 'Note 2', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0003', 'Address 3', 1700000, now(), 'Job 3', 'Note 3', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0004', 'Address 4', 1800000, now(), 'Job 4', 'Note 4', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0005', 'Address 5', 1900000, now(), 'Job 5', 'Note 5', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0006', 'Address 6', 2000000, now(), 'Job 6', 'Note 6', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0007', 'Address 7', 2100000, now(), 'Job 7', 'Note 7', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0008', 'Address 8', 2200000, now(), 'Job 8', 'Note 8', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0009', 'Address 9', 2300000, now(), 'Job 9', 'Note 9', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0010', 'Address 10', 2400000, now(), 'Job 10', 'Note 10', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0011', 'Address 11', 2500000, now(), 'Job 11', 'Note 11', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0012', 'Address 12', 2600000, now(), 'Job 12', 'Note 12', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0013', 'Address 13', 2700000, now(), 'Job 13', 'Note 13', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0014', 'Address 14', 2800000, now(), 'Job 14', 'Note 14', current_date, now()),
('6f708192-5000-4aaa-9bbb-ffff4fff0015', 'Address 15', 2900000, now(), 'Job 15', 'Note 15', current_date, now());

INSERT INTO construction_request (installation_form_code, address, contract_id, created_at,
customer_name, employee_in_charge_id, phone_number,
registration_date, updated_at)
VALUES ('FORM-0001', 'Address 1', 'CONTRACT-1', now(), 'Customer 1', 'EMP-1', '0900000001', current_date, now()),
('FORM-0002', 'Address 2', 'CONTRACT-2', now(), 'Customer 2', 'EMP-2', '0900000002', current_date, now()),
('FORM-0003', 'Address 3', 'CONTRACT-3', now(), 'Customer 3', 'EMP-3', '0900000003', current_date, now()),
('FORM-0004', 'Address 4', 'CONTRACT-4', now(), 'Customer 4', 'EMP-4', '0900000004', current_date, now()),
('FORM-0005', 'Address 5', 'CONTRACT-5', now(), 'Customer 5', 'EMP-5', '0900000005', current_date, now()),
('FORM-0006', 'Address 6', 'CONTRACT-6', now(), 'Customer 6', 'EMP-6', '0900000006', current_date, now()),
('FORM-0007', 'Address 7', 'CONTRACT-7', now(), 'Customer 7', 'EMP-7', '0900000007', current_date, now()),
('FORM-0008', 'Address 8', 'CONTRACT-8', now(), 'Customer 8', 'EMP-8', '0900000008', current_date, now()),
('FORM-0009', 'Address 9', 'CONTRACT-9', now(), 'Customer 9', 'EMP-9', '0900000009', current_date, now()),
('FORM-0010', 'Address 10', 'CONTRACT-10', now(), 'Customer 10', 'EMP-10', '0900000010', current_date, now()),
('FORM-0011', 'Address 11', 'CONTRACT-11', now(), 'Customer 11', 'EMP-11', '0900000011', current_date, now()),
('FORM-0012', 'Address 12', 'CONTRACT-12', now(), 'Customer 12', 'EMP-12', '0900000012', current_date, now()),
('FORM-0013', 'Address 13', 'CONTRACT-13', now(), 'Customer 13', 'EMP-13', '0900000013', current_date, now()),
('FORM-0014', 'Address 14', 'CONTRACT-14', now(), 'Customer 14', 'EMP-14', '0900000014', current_date, now()),
('FORM-0015', 'Address 15', 'CONTRACT-15', now(), 'Customer 15', 'EMP-15', '0900000015', current_date, now());

INSERT INTO cost_estimate (estimation_id, address, construction_machinery_coefficient,
contract_fee, create_by, created_at, customer_name,
design_coefficient, design_fee, design_image_url,
general_cost_coefficient, installation_fee,
labor_coefficient, note, overall_water_meter_id,
precalculated_tax_coefficient, registration_at,
survey_effort, survey_fee, updated_at, vat_coefficient, water_meter_serial,
installation_form_form_code, installation_form_form_number, significance)
VALUES
('7a8192a3-6000-4bbb-9ccc-gggg4ggg0001', 'Address 1', 1, 1000000, 'admin', now(), 'Customer 1', 1, 200000,
'img1', 1, 300000, 1, 'Note 1', 'WM1', 1, current_date, 1, 150000, now(), 1, 'SER1',
'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FORM-2024-0001', '{"surveyStaff": "hehe", "companyLeaderShip": "kaka", "planningTechnicalHead": "huhu"}'),
('7a8192a3-6000-4bbb-9ccc-gggg4ggg0002', 'Address 2', 1, 1000000, 'admin', now(), 'Customer 2', 1, 200000,
'img2', 1, 300000, 1, 'Note 2', 'WM2', 1, current_date, 1, 150000, now(), 1, 'SER2',
'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'FORM-2024-0002', '{"surveyStaff": "hehe", "companyLeaderShip": "kaka", "planningTechnicalHead": "huhu"}'),
('7a8192a3-6000-4bbb-9ccc-gggg4ggg0003', 'Address 3', 1, 1000000, 'admin', now(), 'Customer 3', 1, 200000,
'img3', 1, 300000, 1, 'Note 3', 'WM3', 1, current_date, 1, 150000, now(), 1, 'SER3',
'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'FORM-2024-0003', '{"surveyStaff": "hehe", "companyLeaderShip": "kaka", "planningTechnicalHead": "huhu"}'),
('7a8192a3-6000-4bbb-9ccc-gggg4ggg0004', 'Address 4', 1, 1000000, 'admin', now(), 'Customer 4', 1, 200000,
'img4', 1, 300000, 1, 'Note 4', 'WM4', 1, current_date, 1, 150000, now(),
1, 'SER4', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'FORM-2024-0004', '{
"surveyStaff": "hehe",
"companyLeaderShip": "kaka",
"planningTechnicalHead": "huhu"
}'),
('7a8192a3-6000-4bbb-9ccc-gggg4ggg0005', 'Address 5', 1, 1000000, 'admin', now(), 'Customer 5', 1, 200000,
'img5', 1, 300000, 1, 'Note 5', 'WM5', 1, current_date, 1, 150000, now(), 1, 'SER5',
'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'FORM-2024-0005', '{
"surveyStaff": "hehe",
"companyLeaderShip": "kaka",
"planningTechnicalHead": "huhu"
}');