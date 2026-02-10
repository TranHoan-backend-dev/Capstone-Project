DO
$$
  DECLARE
    role_id1  uuid := 'c4d8f989-0bc5-4c3a-9449-c3db12295a90';
    role_id2  uuid := '6bb525d0-3911-4851-9b8d-d929a080b609';
    role_id3  uuid := 'da4429b4-d7a7-4283-b386-189d69a95af9';
    role_id4  uuid := 'a789aaf0-6153-4f30-ac38-b08e859d5fcb';
    role_id5  uuid := '724184e3-456a-4c89-b3c5-b8ab508f80b5';
    role_id6  uuid := 'e9e6f842-9d4d-4a72-ae1b-ed06115a5119';
    role_id7  uuid := '6844f465-886a-4838-852b-864eb64e7d92';
    role_id8  uuid := '47c469de-21fd-4a32-a468-01a50f4aced6';
    role_id9  uuid := '852841cd-8e76-4eea-a7fe-9b15459d5eea';
    role_id10 uuid := '8ec56833-edd5-4a52-9fc8-256b91e2daca';
--
    user_id1  uuid := '6e9f757b-6fa1-4aa6-b7cb-a4cf2290eb20';
    user_id2  uuid := '14c5879c-a6c4-45a6-846b-39d2b9d8c961';
    u3        uuid := gen_random_uuid();
    u4        uuid := gen_random_uuid();
    u5        uuid := gen_random_uuid();
    u6        uuid := gen_random_uuid();
    u7        uuid := gen_random_uuid();
    u8        uuid := gen_random_uuid();
    u9        uuid := gen_random_uuid();
    u10       uuid := gen_random_uuid();
  BEGIN
    INSERT INTO user_roles(role_id, name)
    VALUES (role_id2, 'IT_STAFF'),
           (role_id1, 'PLANNING_TECHNICAL_DEPARTMENT_HEAD'),
           (role_id3, 'SURVEY_STAFF'),
           (role_id4, 'ORDER_RECEIVING_STAFF'),
           (role_id5, 'FINANCE_DEPARTMENT'),
           (role_id6, 'CONSTRUCTION_DEPARTMENT_HEAD'),
           (role_id7, 'CONSTRUCTION_DEPARTMENT_STAFF'),
           (role_id8, 'BUSINESS_DEPARTMENT_HEAD'),
           (role_id9, 'METER_INSPECTION_STAFF'),
           (role_id10, 'COMPANY_LEADERSHIP');

    insert into users
    values (user_id1, '2025-09-14', 'koofdf', 'efsdf', 'ndd1032003@gmail.com', true, false,
            ARRAY ['asdasd', 'asdasd', 'asdasd'], now(), 'dont know',
            'aeraewrwer', '2025-09-20', 'test', 'sdfsdfs', role_id1),
           (user_id2, '2024-03-24', 'hetyhj', 'argear', 'b@gmail.com', false, false,
            ARRAY ['asdasd', 'asdasd', 'asdasd'], now(), 'eh',
            'htrhrt', '2025-03-12', 'username2', 'sdfsdfs', role_id2),
           (u3, now(), 'DEP03', null, 'user03@mail.com', true, false, 'JOB03', null, null, now(), 'user03', 'WS02',
            role_id3),
           (u4, now(), 'DEP04', null, 'user04@mail.com', true, false, 'JOB04', null, null, now(), 'user04', 'WS02',
            role_id4),
           (u5, now(), 'DEP05', null, 'user05@mail.com', true, false, 'JOB05', null, null, now(), 'user05', 'WS03',
            role_id5),
           (u6, now(), 'DEP06', null, 'user06@mail.com', true, false, 'JOB06', null, null, now(), 'user06', 'WS03',
            role_id6),
           (u7, now(), 'DEP07', null, 'user07@mail.com', true, false, 'JOB07', null, null, now(), 'user07', 'WS04',
            role_id7),
           (u8, now(), 'DEP08', null, 'user08@mail.com', true, false, 'JOB08', null, null, now(), 'user08', 'WS04',
            role_id8),
           (u9, now(), 'DEP09', null, 'user09@mail.com', true, false, 'JOB09', null, null, now(), 'user09', 'WS05',
            role_id9),
           (u10, now(), 'DEP10', null, 'user10@mail.com', true, false, 'JOB10', null, null, now(), 'user10', 'WS05',
            role_id10);

    insert into profile
    values (user_id1, null, null, null, 'fullname1', true, '0949279200'),
           (user_id2, null, null, null, 'fullname2', false, '0949279210'),
           (u3, 'HCM', null, '1990-03-03', 'Fullname 03', true, '0900000003'),
           (u4, 'HCM', null, '1990-04-04', 'Fullname 04', false, '0900000004'),
           (u5, 'DN', null, '1990-05-05', 'Fullname 05', true, '0900000005'),
           (u6, 'DN', null, '1990-06-06', 'Fullname 06', false, '0900000006'),
           (u7, 'CT', null, '1990-07-07', 'Fullname 07', true, '0900000007'),
           (u8, 'CT', null, '1990-08-08', 'Fullname 08', false, '0900000008'),
           (u9, 'HP', null, '1990-09-09', 'Fullname 09', true, '0900000009'),
           (u10, 'HP', null, '1990-10-10', 'Fullname 10', false, '0900000010');
  END
$$;
