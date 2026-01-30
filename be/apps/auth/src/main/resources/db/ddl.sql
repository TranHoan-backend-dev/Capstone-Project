create table individual_notification
(
  notification_id varchar(255)          not null
    primary key,
  is_read         boolean default false not null
);

alter table individual_notification
  owner to postgres;

create table user_roles
(
  role_id varchar(255) not null
    primary key,
  name    varchar(255) not null
    constraint uk182xa1gitcxqhaq6nn3n2kmo3
      unique
    constraint user_roles_name_check
      check ((name)::text = ANY
             ((ARRAY ['IT_DEPARTMENT_STAFF'::character varying, 'PLANNING_TECHNICAL_DEPARTMENT_STAFF'::character varying, 'PLANNING_TECHNICAL_DEPARTMENT_HEAD'::character varying, 'CONSTRUCTION_DEPARTMENT_STAFF'::character varying, 'CONSTRUCTION_DEPARTMENT_HEAD'::character varying, 'SALES_DEPARTMENT_STAFF'::character varying, 'SALES_DEPARTMENT_HEAD'::character varying, 'FINANCE_DEPARTMENT'::character varying])::text[]))
);

alter table user_roles
  owner to postgres;

create table users
(
  user_id                 varchar(255) not null
    primary key,
  created_at              timestamp(6) not null,
  department_id           varchar(255) not null,
  electronic_signing_url  varchar(255),
  email                   varchar(255) not null
    constraint uk6dotkott2kjsp8vw4d0m25fb7
      unique,
  is_enabled              boolean      not null,
  is_locked               boolean      not null,
  job_id                  varchar(255) not null,
  locked_at               timestamp(6),
  locked_reason           varchar(255),
  password                varchar(255) not null,
  updated_at              timestamp(6) not null,
  username                varchar(255) not null
    constraint ukr43af9ap4edm43mmtq01oddj6
      unique,
  water_supply_network_id varchar(255) not null,
  role_id                 varchar(255)
    constraint fkh555fyoyldpyaltlb7jva35j2
      references user_roles
);

alter table users
  owner to postgres;

create table business_pages_of_employees
(
  page_id       varchar(255) not null,
  users_user_id varchar(255) not null
    constraint fkg7u0fnqxlkw834xr6tq1fcgdr
      references users,
  primary key (users_user_id, page_id)
);

alter table business_pages_of_employees
  owner to postgres;

create table employee_job
(
  job_id        varchar(255) not null,
  users_user_id varchar(255) not null
    constraint fki8amwm622upo9s9bxg8l0ofjd
      references users,
  primary key (users_user_id, job_id)
);

alter table employee_job
  owner to postgres;

create table profile
(
  user_id      varchar(255) not null
    primary key
    constraint fks14jvsf9tqrcnly0afsv0ngwv
      references users,
  address      varchar(255),
  avatar_url   varchar(255),
  birthday     date,
  fullname     varchar(255) not null,
  gender       boolean,
  phone_number varchar(255) not null
    constraint ukrc7r62u5tals0tl5rkeyyo5sb
      unique
);

alter table profile
  owner to postgres;

create table verification_codes
(
  email               varchar(255) not null
    primary key,
  attempt_count       integer      not null,
  blocked_until       timestamp(6),
  expired_at          timestamp(6) not null,
  last_generated_time timestamp(6),
  otp_code            varchar(255) not null
);

alter table verification_codes
  owner to postgres;

