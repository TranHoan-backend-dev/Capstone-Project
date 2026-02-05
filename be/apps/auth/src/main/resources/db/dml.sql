DO
$$
  DECLARE
    role_id1 uuid := 'c4d8f989-0bc5-4c3a-9449-c3db12295a90';
    role_id2 uuid := '6bb525d0-3911-4851-9b8d-d929a080b609';
    role_id3 uuid := 'da4429b4-d7a7-4283-b386-189d69a95af9';
    role_id4 uuid := 'a789aaf0-6153-4f30-ac38-b08e859d5fcb';
    role_id5 uuid := '724184e3-456a-4c89-b3c5-b8ab508f80b5';
    role_id6 uuid := 'e9e6f842-9d4d-4a72-ae1b-ed06115a5119';
    role_id7 uuid := '6844f465-886a-4838-852b-864eb64e7d92';
    role_id8 uuid := '47c469de-21fd-4a32-a468-01a50f4aced6';
--
    user_id1 uuid := 'e78050e5-9e87-46d1-a250-957bfeece3f9';
    user_id2 uuid := '14c5879c-a6c4-45a6-846b-39d2b9d8c961';
  BEGIN
    INSERT INTO user_roles(role_id, name)
    VALUES (role_id2, 'IT_DEPARTMENT_STAFF'),
           (role_id1, 'PLANNING_TECHNICAL_DEPARTMENT_STAFF'),
           (role_id3, 'PLANNING_TECHNICAL_DEPARTMENT_HEAD'),
           (role_id4, 'CONSTRUCTION_DEPARTMENT_STAFF'),
           (role_id5, 'CONSTRUCTION_DEPARTMENT_HEAD'),
           (role_id6, 'SALES_DEPARTMENT_STAFF'),
           (role_id7, 'SALES_DEPARTMENT_HEAD'),
           (role_id8, 'FINANCE_DEPARTMENT');

    insert into users
    values (user_id1, '2025-09-14', 'koofdf', 'efsdf', 'a@gmail.com',true, true, ARRAY ['asdasd', 'asdasd', 'asdasd'], now(), 'dont know',
            'aeraewrwer', '2025-09-20', 'username1', 'sdfsdfs', role_id1),
           (user_id2, '2024-03-24', 'hetyhj', 'argear', 'b@gmail.com',false, false, ARRAY ['asdasd', 'asdasd', 'asdasd'], now(), 'eh',
            'htrhrt', '2025-03-12', 'username2', 'sdfsdfs', role_id2);

    insert into profile
    values (user_id1, null, null, null, 'fullname1', true, 0949279200),
           (user_id2, null, null, null, 'fullname2', false, 0949279210);
  END
$$;
