create table public.business_page
(
  page_id  varchar(255) not null
    primary key,
  activate boolean      not null,
  creator  varchar(255) not null,
  name     varchar(255) not null
    constraint ukd95s8n40xd5gu8nf7k5beq3l0
      unique,
  updator  varchar(255) not null
);

alter table public.business_page
  owner to postgres;

create table public.department
(
  department_id varchar(255) not null
    primary key,
  name          varchar(255) not null
    constraint uk1t68827l97cwyxo9r1u6t4p7d
      unique,
  phone_number  varchar(255)
    constraint uk3xtr67uls6rn1u4qy6iy68ffo
      unique
);

alter table public.department
  owner to postgres;

create table public.job
(
  job_id     varchar(255) not null
    primary key,
  created_at timestamp(6) not null,
  name       varchar(255) not null
    constraint ukatcl7ldp04r846fq0cep4e3wi
      unique,
  updated_at timestamp(6) not null
);

alter table public.job
  owner to postgres;

