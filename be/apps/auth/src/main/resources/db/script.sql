DO
$$
  DECLARE
    role_id1 uuid := 'c4d8f989-0bc5-4c3a-9449-c3db12295a90';
    role_id2 uuid := '6bb525d0-3911-4851-9b8d-d929a080b609';
    role_id3 uuid := 'da4429b4-d7a7-4283-b386-189d69a95af9';
    role_id4 uuid := 'a789aaf0-6153-4f30-ac38-b08e859d5fcb';
    role_id5 uuid := '724184e3-456a-4c89-b3c5-b8ab508f80b5';
--
    user_id1 uuid := 'e78050e5-9e87-46d1-a250-957bfeece3f9';
    user_id2 uuid := '14c5879c-a6c4-45a6-846b-39d2b9d8c961';
  BEGIN
    INSERT INTO user_roles(role_id, name)
    VALUES (role_id2, 'IT_DEPARTMENT'),
           (role_id1, 'PLANNING_TECHNICAL_DEPARTMENT'),
           (role_id3, 'CONSTRUCTION_DEPARTMENT'),
           (role_id4, 'SALES_DEPARTMENT'),
           (role_id5, 'FINANCE_DEPARTMENT');

    insert into users
    values (user_id1, ARRAY ['asdasd', 'asdasd', 'asdasd'], now(), 'eh', 'a@gmail.com',
            true, true, 'dfgsdfg', null, null, ARRAY ['asdasd', 'asdasd', 'asdasd'], 'iugkgvkhv', now(), 'asda', 'sg',
            role_id1),
           (user_id2, ARRAY ['asdasd', 'asdasd', 'asdasd'], now(), 'eh', 'b@gmail.com',
            false, false, 'dfgsdfg', null, null, ARRAY ['asdasd', 'asdasd', 'asdasd'], 'iugkgvkhv', now(), 'asf', 'sg',
            role_id2);

    insert into profile
    values (user_id1, null, null, null, 'fullname1', true, 0949279200),
           (user_id2, null, null, null, 'fullname2', false, 0949279200);
  END
$$;
