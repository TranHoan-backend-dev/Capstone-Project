CREATE
EXTENSION IF NOT EXISTS unaccent;

create table public.materials_group
(
  group_id   varchar(255) not null
    primary key,
  created_at timestamp(6) not null,
  name       varchar(255) not null constraint ukp5q73e1ej9oy70w2tvbl2502u
            unique,
  updated_at timestamp(6) not null
);

alter table public.materials_group
  owner to postgres;

create table public.overall_water_meter
(
  serial     varchar(255) not null
    primary key,
  lateral_id varchar(255) not null,
  name       varchar(255) not null constraint ukb3dd1t3sdcwe8sbqfrf9dfyif
            unique
);

alter table public.overall_water_meter
  owner to postgres;

create table public.parameters
(
  param_id   varchar(255)   not null
    primary key,
  created_at timestamp(6)   not null,
  creator    varchar(255)   not null,
  name       varchar(255)   not null constraint uk103wr298mpbr2vhx5tr7ila1o
            unique,
  updated_at timestamp(6)   not null,
  updator    varchar(255)   not null,
  value      numeric(38, 2) not null
);

alter table public.parameters
  owner to postgres;

create table public.price_type
(
  price_type_id varchar(255) not null
    primary key,
  area          varchar(255),
  price jsonb
);

alter table public.price_type
  owner to postgres;

create table public.unit
(
  unit_id    varchar(255) not null
    primary key,
  created_at timestamp(6) not null,
  name       varchar(255) not null constraint ukaa58c9de9eu0v585le47w25my
            unique,
  updated_at timestamp(6) not null
);

alter table public.unit
  owner to postgres;

create table public.material
(
  material_id                                   varchar(255)   not null
    primary key,
  construction_machinery_price                  numeric(19, 2) not null,
  construction_machinery_price_at_rural_commune numeric(19, 2) not null,
  created_at                                    timestamp(6)   not null,
  job_content                                   text           not null,
  labor_code                                    text           not null,
  labor_price                                   numeric(19, 2) not null,
  labor_price_at_rural_commune                  numeric(19, 2) not null,
  price                                         numeric(19, 2) not null,
  updated_at                                    timestamp(6)   not null,
  supplies_group_id                             varchar(255) constraint fki493ecucvdjagvmlbalqgaeb0
            references public.materials_group,
  calculation_unit_id                           varchar(255) constraint fkbvkkik21h23aisjcbbpgafst6
            references public.unit
);

alter table public.material
  owner to postgres;

create table public.materials_of_cost_estimate
(
  cost_est_id           varchar(255)             not null,
  mass                  real                     not null,
  note                  varchar(255),
  reduction_coefficient numeric(38, 2) default 0 not null,
  total_labor_cost      varchar(255),
  total_material_cost   varchar(255),
  material_material_id  varchar(255)             not null constraint fk8hlrkyr0pdjjk5yooog6ewvin
            references public.material,
  primary key (cost_est_id, material_material_id)
);

alter table public.materials_of_cost_estimate
  owner to postgres;

create table public.materials_of_settlement
(
  settlement_id        varchar(255) not null,
  labor_cost           varchar(255) not null,
  material_cost        varchar(255) not null,
  note                 varchar(255),
  material_material_id varchar(255) not null constraint fkaueyvhmdiruotg5pccb1bpaou
            references public.material,
  primary key (material_material_id, settlement_id)
);

alter table public.materials_of_settlement
  owner to postgres;

create table public.water_meter_type
(
  type_id     varchar(255) not null
    primary key,
  created_at  timestamp(6) not null,
  diameter    real,
  max_index   varchar(255),
  meter_model varchar(255) not null,
  name        varchar(255) not null,
  origin      varchar(255) not null,
  qmin        varchar(255),
  qn          varchar(255),
  qt          varchar(255),
  size        integer,
  updated_at  timestamp(6) not null
);

alter table public.water_meter_type
  owner to postgres;

create table public.water_meter
(
  meter_code          varchar(255) not null
    primary key,
  installation_date   date         not null,
  size                integer      not null,
  water_meter_type_id varchar(255) constraint fk918g3f2rs9p2b4uujx5h01kiq
            references public.water_meter_type
);

alter table public.water_meter
  owner to postgres;

create table public.usage_history
(
  customer_id varchar(255) not null constraint uk7bgg9a3lubti663eagw8kamso
            unique,
  usages jsonb,
  meter_code  varchar(255) not null
    primary key constraint fkrxiqn18008bmpbc73g3acvm3o
            references public.water_meter
);

alter table public.usage_history
  owner to postgres;

create table public.water_price
(
  price_id           varchar(255)   not null
    primary key,
  application_period date           not null,
  created_at         timestamp(6)   not null,
  description        varchar(255)   not null constraint uk96vl1pb7ei7mnv3c2n0d1ym20
            unique,
  environment_price  numeric(38, 2),
  expiration_date    date           not null,
  tax                numeric(38, 2) not null,
  updated_at         timestamp(6)   not null,
  usage_target       varchar(255)   not null constraint water_price_usage_target_check
            check ((usage_target)::text = ANY
                   ((ARRAY ['DOMESTIC'::character varying, 'INSTITUTIONAL'::character varying, 'INDUSTRIAL'::character varying, 'COMMERCIAL'::character varying])::text[]))
);

alter table public.water_price
  owner to postgres;

create table public.water_price_price_types
(
  water_price_price_id      varchar(255) not null constraint fkhgabkm67kgm264uwq6shrfw7r
            references public.water_price,
  price_types_price_type_id varchar(255) not null constraint fkdb51bbihy0304wg8eg4omfu1i
            references public.price_type
);

alter table public.water_price_price_types
  owner to postgres;
