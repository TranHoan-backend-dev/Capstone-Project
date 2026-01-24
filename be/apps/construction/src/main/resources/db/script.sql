USE microservice;

INSERT INTO roles(roles.role_id, roles.name)
VALUES (UUID(), 'CUSTOMER'),
       (UUID(), 'ADMIN'),
       (UUID(), 'EMPLOYEE');
