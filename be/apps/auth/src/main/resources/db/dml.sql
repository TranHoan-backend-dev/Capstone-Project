DO
$$
  DECLARE
    role_id1  uuid      := 'c4d8f989-0bc5-4c3a-9449-c3db12295a90';
    role_id2  uuid      := '6bb525d0-3911-4851-9b8d-d929a080b609';
    role_id3  uuid      := 'da4429b4-d7a7-4283-b386-189d69a95af9';
    role_id4  uuid      := 'a789aaf0-6153-4f30-ac38-b08e859d5fcb';
    role_id5  uuid      := '724184e3-456a-4c89-b3c5-b8ab508f80b5';
    role_id6  uuid      := 'e9e6f842-9d4d-4a72-ae1b-ed06115a5119';
    role_id7  uuid      := '6844f465-886a-4838-852b-864eb64e7d92';
    role_id8  uuid      := '47c469de-21fd-4a32-a468-01a50f4aced6';
    role_id9  uuid      := '852841cd-8e76-4eea-a7fe-9b15459d5eea';
    role_id10 uuid      := '8ec56833-edd5-4a52-9fc8-256b91e2daca';
--
    user_id1  uuid      := '6e9f757b-6fa1-4aa6-b7cb-a4cf2290eb20';
    user_id2  uuid      := '14c5879c-a6c4-45a6-846b-39d2b9d8c961';
    u3        uuid      := 'c8357517-3149-41b4-9b2c-881d5a40840a';
    u4        uuid      := 'bd5bc9bb-303d-425f-9f2e-90f83ef75ee8';
    u5        uuid      := '1cef2ae0-3151-405c-b717-61be20679d79';
    u6        uuid      := '71bc19b9-4a86-4ff9-aa26-3fc037569cfd';
    u7        uuid      := 'eae87df0-7f02-47b9-baa2-ac2bc9ea61fb';
    u8        uuid      := 'd4039a01-4408-4fad-8676-05ef81532eb5';
    u9        uuid      := 'e6876430-7145-4e43-aac3-dd53ca4f068a';
    u10       uuid      := '67d04cc3-b4b8-44b9-ba41-91a1e477617a';
    page_ids  uuid[]    := ARRAY [
      '86088520-f274-4ac2-a94b-b761995abf4a', '4c3cdd22-5018-482c-bc34-51331e7167a9',
      'b4758afc-f456-4538-aabe-3d09a4591f34', 'b13d7531-4935-4da6-972e-04bbda46b47a',
      '88e1d15b-2407-487f-b4e1-aa96e18f0d85', 'ceedf230-1a7a-4c9d-b0c1-ce635d301ff3',
      '739f3f11-6947-4135-98ed-f3e59e790d1b', 'f16aa118-8f06-42c6-93f8-22fd9e06e071',
      '7d0d26c3-b236-4109-a7cc-5b36fa65b2dd', 'c3d78a4c-f262-4d16-bee3-ffe0d7c50e78',
      '94d31724-2d18-4d93-be2a-6a3336fcf0ce', '9a8a209a-b8d5-44e1-b7ab-7ed6a5e6e37c',
      '59ae463d-90dd-463e-beae-969df2c66272', 'b3b1d1ec-9c86-45ff-acb2-31c89b1a748c',
      '8b209371-21bf-4721-a390-12d1dcfc5d98', 'b81720dd-be50-4b31-8310-9e10f6d98198',
      'e617e074-18b1-4f20-8c19-beb815db7406', 'a72a7a72-ef63-4e19-9a1d-294088fd91d1',
      '88384dc8-2150-44f9-9691-202794fb00e2', 'e70256d4-0ceb-4fe6-94bb-78fb2261fd88',
      'bff81f4f-e6be-4750-8d4c-fb4d21b903ae'
      ];
    job_ids   varchar[] := ARRAY [
      '2420a323-e180-4927-b956-654761026048', 'b450503c-e30d-45be-803e-ac3226756811',
      '8718a38c-a113-4395-97df-036113b246a4', 'c374665f-4a65-4d08-8e68-8de1b369c762',
      'f8b63116-419b-43d9-9596-f9e421e428df', '4b35e298-2a78-4573-8c46-8f8303036006',
      'a785311e-8d02-4091-af5e-88091152a513', '0586026a-9366-48c3-982e-9d821215b22b',
      '93268800-410a-4876-b333-662369656828', '18177579-2475-4702-a164-9685652613b1',
      '065842c2-8025-4c07-bc7e-976402422731', 'd8d21c38-8924-4061-827d-c36399996614',
      '56475704-5001-443b-a25e-e47573677461', '2060377b-665e-49b4-825e-d21820625406',
      '09492160-c3d3-467a-b924-cc0985550c60', '50212f45-0370-4322-a7d5-d14300329759',
      '47585141-9496-4148-8df5-e1150495368a', '0a082087-0b13-491b-b72e-848821958210',
      '0684277b-7b06-4475-8162-817651877607', '36526154-1296-4660-8488-842230006322',
      '06085521-1221-4470-8255-888461741517', '96336688-2122-4462-8114-118833989911',
      '55266155-5221-4471-8963-229944118822', '44115599-2288-4433-7744-996633221144',
      '88552211-1144-4477-8855-663322114477', '77441122-8855-4466-9966-332211445588',
      '66332255-7744-4455-8844-551122336699', '55221144-8855-4422-7711-663322558800',
      '44115599-6633-4411-2288-112233445566', '33224488-5522-4433-1177-889966554433'
      ];
    user_ids  uuid[]    := ARRAY [user_id1, user_id2, u3, u4, u5, u6, u7, u8, u9, u10];
    p_id      uuid;
    u_id      uuid;
    j_id      varchar;
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
            null, null, now(), 'test', 'sdfsdfs', role_id1),
           (user_id2, '2024-03-24', 'hetyhj', 'argear', 'b@gmail.com', false, false,
            now(), 'eh', '2025-03-12', 'username2', 'sdfsdfs', role_id2),
           (u3, now(), 'DEP03', null, 'user03@mail.com', true, false, null, null, now(), 'user03', 'WS02',
            role_id3),
           (u4, now(), 'DEP04', null, 'user04@mail.com', true, false, null, null, now(), 'user04', 'WS02',
            role_id4),
           (u5, now(), 'DEP05', null, 'user05@mail.com', true, false, null, null, now(), 'user05', 'WS03',
            role_id5),
           (u6, now(), 'DEP06', null, 'user06@mail.com', true, false, null, null, now(), 'user06', 'WS03',
            role_id6),
           (u7, now(), 'DEP07', null, 'user07@mail.com', true, false, null, null, now(), 'user07', 'WS04',
            role_id7),
           (u8, now(), 'DEP08', null, 'user08@mail.com', true, false, null, null, now(), 'user08', 'WS04',
            role_id8),
           (u9, now(), 'DEP09', null, 'user09@mail.com', true, false, null, null, now(), 'user09', 'WS05',
            role_id9),
           (u10, now(), 'DEP10', null, 'user10@mail.com', true, false, null, null, now(), 'user10', 'WS05',
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

    FOREACH u_id IN ARRAY user_ids
      LOOP
        FOREACH p_id IN ARRAY page_ids
          LOOP
            INSERT INTO business_pages_of_employees(users_user_id, page_id) VALUES (u_id, p_id);
          END LOOP;

        FOREACH j_id IN ARRAY job_ids
          LOOP
            INSERT INTO employee_job(users_user_id, job_id) VALUES (u_id, j_id);
          END LOOP;
      END LOOP;
  END
$$;
