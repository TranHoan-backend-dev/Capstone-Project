DELETE
FROM installation_form;
DELETE
FROM laterals;
DELETE
FROM water_supply_network;
DELETE
FROM neighborhood_unit;
DELETE
FROM hamlet;
DELETE
FROM commune;
DELETE
FROM road;
DELETE
FROM settlement;
DELETE
FROM construction_request;
DELETE
FROM cost_estimate;
DELETE
FROM roadmap;

INSERT INTO installation_form (form_code, address, bank_account_number, bank_account_provider_location,
                               citizen_identification_number, citizen_identification_provide_date,
                               citizen_identification_provide_location, created_at, created_by, customer_name,
                               form_number, household_registration_number, number_of_household, overall_water_meter_id,
                               phone_number, received_form_at, updated_at, usage_target, customer_type, handover_by,
                               representative, schedule_survey_at, status, tax_code, water_supply_network_id)
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
       ('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '202 Vo Thi Sau, District 3, HCMC', '190312345682', 'Sacombank HCMC',
        '079090000005', '2020-01-05', 'CA TPHCM', '2024-01-05 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Hoang Van E', 'FORM-2024-0005', 523456, 6, 'METER-005', '0901234571', '2024-01-05 09:00:00',
        '2024-01-05 10:00:00', 'INSTITUTIONAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', '303 Cach Mang Thang 8, District 10, HCMC', '190312345683',
        'VPBank HCMC', '079090000006', '2020-01-06', 'CA TPHCM', '2024-01-06 10:00:00',
        'c8357517-3149-41b4-9b2c-881d5a40840a', 'Vu Thi F', 'FORM-2024-0006', 623456, 4, 'METER-006', '0901234572',
        '2024-01-06 09:00:00', '2024-01-06 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('06eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', '404 Ly Thuong Kiet, District 10, HCMC', '190312345684', 'MBBank HCMC',
        '079090000007', '2020-01-07', 'CA TPHCM', '2024-01-07 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Do Van G', 'FORM-2024-0007', 723456, 3, 'METER-007', '0901234573', '2024-01-07 09:00:00',
        '2024-01-07 10:00:00', 'INDUSTRIAL', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('17eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', '505 Nguyen Trai, District 5, HCMC', '190312345685', 'TPBank HCMC',
        '079090000008', '2020-01-08', 'CA TPHCM', '2024-01-08 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Ngo Thi H', 'FORM-2024-0008', 823456, 5, 'METER-008', '0901234574', '2024-01-08 09:00:00',
        '2024-01-08 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('28eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', '606 Tran Hung Dao, District 1, HCMC', '190312345686', 'VIB HCMC',
        '079090000009', '2020-01-09', 'CA TPHCM', '2024-01-09 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Bui Van I', 'FORM-2024-0009', 923456, 2, 'METER-009', '0901234575', '2024-01-09 09:00:00',
        '2024-01-09 10:00:00', 'COMMERCIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('39eebc99-9c0b-4ef8-bb6d-6bb9bd380a1a', '707 Le Duan, District 1, HCMC', '190312345687', 'Techcombank HCMC',
        '079090000010', '2020-01-10', 'CA TPHCM', '2024-01-10 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Dang Thi K', 'FORM-2024-0010', 133456, 4, 'METER-010', '0901234576', '2024-01-10 09:00:00',
        '2024-01-10 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('4aeebc99-9c0b-4ef8-bb6d-6bb9bd380a1b', '808 Nam Ky Khoi Nghia, District 3, HCMC', '190312345688',
        'Vietcombank HCMC', '079090000011', '2020-01-11', 'CA TPHCM', '2024-01-11 10:00:00',
        'c8357517-3149-41b4-9b2c-881d5a40840a', 'Duong Van L', 'FORM-2024-0011', 233456, 3, 'METER-011', '0901234577',
        '2024-01-11 09:00:00', '2024-01-11 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('5beebc99-9c0b-4ef8-bb6d-6bb9bd380a1c', '909 Pasteur, District 3, HCMC', '190312345689', 'ACB HCMC',
        '079090000012', '2020-01-12', 'CA TPHCM', '2024-01-12 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Ly Thi M', 'FORM-2024-0012', 333456, 5, 'METER-012', '0901234578', '2024-01-12 09:00:00',
        '2024-01-12 10:00:00', 'INSTITUTIONAL', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('6ceebc99-9c0b-4ef8-bb6d-6bb9bd380a1d', '111 Hoang Van Thu, Phu Nhuan, HCMC', '190312345690', 'BIDV HCMC',
        '079090000013', '2020-01-13', 'CA TPHCM', '2024-01-13 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Mai Van N', 'FORM-2024-0013', 433456, 2, 'METER-013', '0901234579', '2024-01-13 09:00:00',
        '2024-01-13 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('7deebc99-9c0b-4ef8-bb6d-6bb9bd380a1e', '222 Phan Dang Luu, Phu Nhuan, HCMC', '190312345691', 'Sacombank HCMC',
        '079090000014', '2020-01-14', 'CA TPHCM', '2024-01-14 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Cao Thi O', 'FORM-2024-0014', 533456, 6, 'METER-014', '0901234580', '2024-01-14 09:00:00',
        '2024-01-14 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('8eeebc99-9c0b-4ef8-bb6d-6bb9bd380a1f', '333 Bach Dang, Binh Thanh, HCMC', '190312345692', 'VPBank HCMC',
        '079090000015', '2020-01-15', 'CA TPHCM', '2024-01-15 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Doan Van P', 'FORM-2024-0015', 633456, 4, 'METER-015', '0901234581', '2024-01-15 09:00:00',
        '2024-01-15 10:00:00', 'INDUSTRIAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('9feebc99-9c0b-4ef8-bb6d-6bb9bd380a20', '444 Xoviet Nghe Tinh, Binh Thanh, HCMC', '190312345693', 'MBBank HCMC',
        '079090000016', '2020-01-16', 'CA TPHCM', '2024-01-16 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Truong Thi Q', 'FORM-2024-0016', 733456, 3, 'METER-016', '0901234582', '2024-01-16 09:00:00',
        '2024-01-16 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('a0febc99-9c0b-4ef8-bb6d-6bb9bd380a21', '555 Kha Van Can, Thu Duc, HCMC', '190312345694', 'TPBank HCMC',
        '079090000017', '2020-01-17', 'CA TPHCM', '2024-01-17 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Phan Van R', 'FORM-2024-0017', 833456, 5, 'METER-017', '0901234583', '2024-01-17 09:00:00',
        '2024-01-17 10:00:00', 'COMMERCIAL', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('b1febc99-9c0b-4ef8-bb6d-6bb9bd380a22', '666 Pham Van Dong, Thu Duc, HCMC', '190312345695', 'VIB HCMC',
        '079090000018', '2020-01-18', 'CA TPHCM', '2024-01-18 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Trinh Thi S', 'FORM-2024-0018', 933456, 2, 'METER-018', '0901234584', '2024-01-18 09:00:00',
        '2024-01-18 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('c2febc99-9c0b-4ef8-bb6d-6bb9bd380a23', '777 Vo Van Ngan, Thu Duc, HCMC', '190312345696', 'Techcombank HCMC',
        '079090000019', '2020-01-19', 'CA TPHCM', '2024-01-19 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Dinh Van T', 'FORM-2024-0019', 143456, 4, 'METER-019', '0901234585', '2024-01-19 09:00:00',
        '2024-01-19 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('d3febc99-9c0b-4ef8-bb6d-6bb9bd380a24', '888 Le Van Viet, District 9, HCMC', '190312345697', 'Vietcombank HCMC',
        '079090000020', '2020-01-20', 'CA TPHCM', '2024-01-20 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Lam Thi U', 'FORM-2024-0020', 243456, 3, 'METER-020', '0901234586', '2024-01-20 09:00:00',
        '2024-01-20 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('e4febc99-9c0b-4ef8-bb6d-6bb9bd380a25', '999 Do Xuan Hop, District 9, HCMC', '190312345698', 'ACB HCMC',
        '079090000021', '2020-01-21', 'CA TPHCM', '2024-01-21 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Ha Van V', 'FORM-2024-0021', 343456, 5, 'METER-021', '0901234587', '2024-01-21 09:00:00',
        '2024-01-21 10:00:00', 'INSTITUTIONAL', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('f5febc99-9c0b-4ef8-bb6d-6bb9bd380a26', '121 Nguyen Thi Dinh, District 2, HCMC', '190312345699', 'BIDV HCMC',
        '079090000022', '2020-01-22', 'CA TPHCM', '2024-01-22 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Chau Thi X', 'FORM-2024-0022', 443456, 2, 'METER-022', '0901234588', '2024-01-22 09:00:00',
        '2024-01-22 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('06febc99-9c0b-4ef8-bb6d-6bb9bd380a27', '232 Luong Dinh Cua, District 2, HCMC', '190312345700',
        'Sacombank HCMC', '079090000023', '2020-01-23', 'CA TPHCM', '2024-01-23 10:00:00',
        'c8357517-3149-41b4-9b2c-881d5a40840a', 'Ta Van Y', 'FORM-2024-0023', 543456, 6, 'METER-023', '0901234589',
        '2024-01-23 09:00:00', '2024-01-23 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('17febc99-9c0b-4ef8-bb6d-6bb9bd380a28', '343 Mai Chi Tho, District 2, HCMC', '190312345701', 'VPBank HCMC',
        '079090000024', '2020-01-24', 'CA TPHCM', '2024-01-24 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Khuong Thi Z', 'FORM-2024-0024', 643456, 4, 'METER-024', '0901234590', '2024-01-24 09:00:00',
        '2024-01-24 10:00:00', 'INDUSTRIAL', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('28febc99-9c0b-4ef8-bb6d-6bb9bd380a29', '454 Dong Van Cong, District 2, HCMC', '190312345702', 'MBBank HCMC',
        '079090000025', '2020-01-25', 'CA TPHCM', '2024-01-25 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Quach Van A1', 'FORM-2024-0025', 743456, 3, 'METER-025', '0901234591', '2024-01-25 09:00:00',
        '2024-01-25 10:00:00', 'DOMESTIC', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('39febc99-9c0b-4ef8-bb6d-6bb9bd380a2a', '565 Nguyen Van Linh, District 7, HCMC', '190312345703', 'TPBank HCMC',
        '079090000026', '2020-01-26', 'CA TPHCM', '2024-01-26 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Tieu Thi B1', 'FORM-2024-0026', 843456, 5, 'METER-026', '0901234592', '2024-01-26 09:00:00',
        '2024-01-26 10:00:00', 'COMMERCIAL', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('4afebc99-9c0b-4ef8-bb6d-6bb9bd380a2b', '676 Huynh Tan Phat, District 7, HCMC', '190312345704', 'VIB HCMC',
        '079090000027', '2020-01-27', 'CA TPHCM', '2024-01-27 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Bach Van C1', 'FORM-2024-0027', 943456, 2, 'METER-027', '0901234593', '2024-01-27 09:00:00',
        '2024-01-27 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('5bfebc99-9c0b-4ef8-bb6d-6bb9bd380a2c', '787 Nguyen Thi Thap, District 7, HCMC', '190312345705',
        'Techcombank HCMC', '079090000028', '2020-01-28', 'CA TPHCM', '2024-01-28 10:00:00',
        'c8357517-3149-41b4-9b2c-881d5a40840a', 'Lang Thi D1', 'FORM-2024-0028', 153456, 4, 'METER-028', '0901234594',
        '2024-01-28 09:00:00', '2024-01-28 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('6cfebc99-9c0b-4ef8-bb6d-6bb9bd380a2d', '898 Le Van Luong, District 7, HCMC', '190312345706',
        'Vietcombank HCMC', '079090000029', '2020-01-29', 'CA TPHCM', '2024-01-29 10:00:00',
        'c8357517-3149-41b4-9b2c-881d5a40840a', 'Dam Van E1', 'FORM-2024-0029', 253456, 3, 'METER-029', '0901234595',
        '2024-01-29 09:00:00', '2024-01-29 10:00:00', 'DOMESTIC', 'FAMILY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL),
       ('7dfebc99-9c0b-4ef8-bb6d-6bb9bd380a2e', '909 Nguyen Huu Tho, Nha Be, HCMC', '190312345707', 'ACB HCMC',
        '079090000030', '2020-01-30', 'CA TPHCM', '2024-01-30 10:00:00', 'c8357517-3149-41b4-9b2c-881d5a40840a',
        'Ung Thi F1', 'FORM-2024-0030', 353456, 5, 'METER-030', '0901234596', '2024-01-30 09:00:00',
        '2024-01-30 10:00:00', 'INSTITUTIONAL', 'COMPANY', NULL, NULL, NULL, '{
         "contract": "PROCESSING",
         "estimate": "PROCESSING",
         "construction": "PROCESSING",
         "registration": "PROCESSING"
       }', NULL, NULL);

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
VALUES ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0001', now(), 'KĐT Hòa Vượng', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0002', now(), 'KĐT Mỹ Trung', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0003', now(), 'KĐT Thống Nhất', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0004', now(), 'Đường 38A', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0005', now(), 'Bắc Mỹ Tân', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0006', now(), 'Đường 10', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0007', now(), 'Đệ tứ', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0008', now(), 'Nam Mỹ Tân', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0009', now(), 'Quốc lộ 10', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0010', now(), 'Đường Trần Thừa', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0011', now(), 'Trần Thái Tông', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0012', now(), 'Hoàng Văn Thái', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0013', now(), 'Nguyễn Hữu Huân', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0014', now(), 'Đường Nam Ninh Hải', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0015', now(), 'Đường 21', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0016', now(), 'Đường 21B', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0017', now(), 'Đường 488B', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0018', now(), 'Đường 53B', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0019', now(), 'Cầu Điện Biên', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0020', now(), 'Chợ Mới', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0021', now(), 'Chợ Cũ Ngõ I+II', now()),
       ('3c4d5e6f-2000-4ccc-9ddd-cccccccc0022', now(), 'Cầu Trạm Xá', now());

INSERT INTO laterals (lateral_id, created_at, name, updated_at, water_supply_network_id)
VALUES ('4d5e6f70-3000-4ddd-9eee-dddddddd0001', now(), 'A300', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0002', now(), 'B600m', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0003', now(), 'A600c', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0004', now(), 'C400', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0005', now(), 'Năng Tĩnh', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0006', now(), 'Cửa Bắc', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0007', now(), 'Bà Triệu', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0008', now(), 'Lộc Vượng', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0009', now(), 'Hạ Long', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0010', now(), 'Mỹ Tân', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0011', now(), 'Cấp nước Nam Định', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0012', now(), 'Lộc Hạ', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0013', now(), 'Lộc Hòa', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0014', now(), 'Mỹ Xá', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0015', now(), 'Thống Nhất', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0016', now(), 'Trần Tế Xương', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0017', now(), 'DHT Trực Ninh', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0018', now(), 'CQ Trực Ninh 1', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0019', now(), 'Cụm CN', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0020', now(), 'Xã Ninh Giang', now(), NULL),
       ('4d5e6f70-3000-4ddd-9eee-dddddddd0021', now(), 'Xã Cổ Lễ', now(), NULL);

INSERT INTO roadmap (roadmap_id, created_at, name, updated_at, lateral_id, water_supply_network_id)
VALUES ('5e6f7081-4000-4eee-9fff-eeeeeeee0001', now(), '108-111-112e', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0002', now(), '108-111-112f', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0003', now(), '108-111-112g', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0004', now(), '06Va', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0005', now(), '06Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0006', now(), '29Va', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0007', now(), '29Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0008', now(), '29Vc', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0009', now(), '31Va', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0010', now(), '31Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0011', now(), '31Vc', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0012', now(), '08Va', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0013', now(), '08Vb', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0001',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0014', now(), '134a', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0015', now(), '134b', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0016', now(), '179a', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0017', now(), '179b', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0018', now(), '188a', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0019', now(), '188b', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0003',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0020', now(), '197-198', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0002',
        '550e8400-e29b-41d4-a716-446655440001'),
       ('5e6f7081-4000-4eee-9fff-eeeeeeee0021', now(), '172a', now(), '4d5e6f70-3000-4ddd-9eee-dddddddd0001',
        '550e8400-e29b-41d4-a716-446655440001');

INSERT INTO settlement (settlement_id, address, connection_fee, created_at,
                        job_content, note, registration_at, status, updated_at)
VALUES ('6f708192-5000-4aaa-9bbb-ffffffff0001', 'Address 1', 1500000, now(), 'Job 1', 'Note 1', current_date,
        'PROCESSING', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0002', 'Address 2', 1600000, now(), 'Job 2', 'Note 2', current_date,
        'PENDING_FOR_APPROVAL', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0003', 'Address 3', 1700000, now(), 'Job 3', 'Note 3', current_date,
        'APPROVED', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0004', 'Address 4', 1800000, now(), 'Job 4', 'Note 4', current_date,
        'REJECTED', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0005', 'Address 5', 1900000, now(), 'Job 5', 'Note 5', current_date,
        'PROCESSING', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0006', 'Address 6', 2000000, now(), 'Job 6', 'Note 6', current_date,
        'PENDING_FOR_APPROVAL', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0007', 'Address 7', 2100000, now(), 'Job 7', 'Note 7', current_date,
        'APPROVED', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0008', 'Address 8', 2200000, now(), 'Job 8', 'Note 8', current_date,
        'REJECTED', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0009', 'Address 9', 2300000, now(), 'Job 9', 'Note 9', current_date,
        'PROCESSING', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0010', 'Address 10', 2400000, now(), 'Job 10', 'Note 10', current_date,
        'APPROVED', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0011', 'Address 11', 2500000, now(), 'Job 11', 'Note 11', current_date,
        'PROCESSING', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0012', 'Address 12', 2600000, now(), 'Job 12', 'Note 12', current_date,
        'PENDING_FOR_APPROVAL', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0013', 'Address 13', 2700000, now(), 'Job 13', 'Note 13', current_date,
        'APPROVED', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0014', 'Address 14', 2800000, now(), 'Job 14', 'Note 14', current_date,
        'REJECTED', now()),
       ('6f708192-5000-4aaa-9bbb-ffffffff0015', 'Address 15', 2900000, now(), 'Job 15', 'Note 15', current_date,
        'PROCESSING', now());

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
  ('7a8192a3-6000-4bbb-9ccc-gggggggg0001', 'Address 1', 1, 1000000, 'admin', now(), 'Customer 1', 1, 200000,
        'img1', 1, 300000, 1, 'Note 1', 'WM1', 1, current_date, 1, 150000, now(), 1, 'SER1',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FORM-2024-0001', '{"surveyStaff": "hehe", "companyLeaderShip": "kaka", "planningTechnicalHead": "huhu"}'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0002', 'Address 2', 1, 1000000, 'admin', now(), 'Customer 2', 1, 200000,
        'img2', 1, 300000, 1, 'Note 2', 'WM2', 1, current_date, 1, 150000, now(), 1, 'SER2',
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'FORM-2024-0002', '{"surveyStaff": "hehe", "companyLeaderShip": "kaka", "planningTechnicalHead": "huhu"}'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0003', 'Address 3', 1, 1000000, 'admin', now(), 'Customer 3', 1, 200000,
        'img3', 1, 300000, 1, 'Note 3', 'WM3', 1, current_date, 1, 150000, now(), 1, 'SER3',
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'FORM-2024-0003', '{"surveyStaff": "hehe", "companyLeaderShip": "kaka", "planningTechnicalHead": "huhu"}'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0004', 'Address 4', 1, 1000000, 'admin', now(), 'Customer 4', 1, 200000,
        'img4', 1, 300000, 1, 'Note 4', 'WM4', 1, current_date, 1, 150000, now(),
        1, 'SER4', 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'FORM-2024-0004', '{
         "surveyStaff": "hehe",
         "companyLeaderShip": "kaka",
         "planningTechnicalHead": "huhu"
       }'),
       ('7a8192a3-6000-4bbb-9ccc-gggggggg0005', 'Address 5', 1, 1000000, 'admin', now(), 'Customer 5', 1, 200000,
        'img5', 1, 300000, 1, 'Note 5', 'WM5', 1, current_date, 1, 150000, now(), 1, 'SER5',
        'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'FORM-2024-0005', '{
         "surveyStaff": "hehe",
         "companyLeaderShip": "kaka",
         "planningTechnicalHead": "huhu"
       }');
