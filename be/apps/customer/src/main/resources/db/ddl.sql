CREATE
EXTENSION IF NOT EXISTS unaccent;

create table public.customer
(
  customer_id                       varchar(255) not null
    primary key,
  bank_account_name                 varchar(255) not null,
  bank_account_number               varchar(255) not null,
  bank_account_provider_location    varchar(255) not null,
  budget_relationship_code          varchar(255),
  cancel_reason                     varchar(255),
  citizen_identification_number     varchar(255) not null,
  citizen_identification_provide_at varchar(255) not null,
  connection_point                  varchar(255),
  created_at                        timestamp(6) not null,
  deduction_period                  varchar(255),
  email                             varchar(255) not null,
  fix_rate                          varchar(255),
  form_code                         varchar(255) not null
    constraint ukmcy3y2nfbclxl4b7u6gu6f1j
      unique,
  form_number                       varchar(255) not null,
  household_registration_number     integer      not null,
  installation_fee                  integer,
  is_active                         boolean      not null,
  is_big_customer                   boolean      not null,
  is_free                           boolean,
  is_sale                           boolean,
  m3sale                            varchar(255),
  monthly_rent                      integer,
  name                              varchar(255) not null,
  number_of_households              integer      not null,
  passport_code                     varchar(255),
  payment_method                    varchar(255) not null,
  phone_number                      varchar(255) not null,
  protect_environment_fee           integer      not null,
  type                              varchar(255) not null
    constraint customer_type_check
      check ((type)::text = ANY ((ARRAY ['FAMILY'::character varying, 'COMPANY'::character varying])::text[])),
  updated_at                        timestamp(6) not null,
  usage_target                      varchar(255) not null
    constraint customer_usage_target_check
      check ((usage_target)::text = ANY
             ((ARRAY ['DOMESTIC'::character varying, 'INSTITUTIONAL'::character varying, 'INDUSTRIAL'::character varying, 'COMMERCIAL'::character varying])::text[])),
  water_meter_id                    varchar(255) not null,
  water_meter_type                  varchar(255) not null,
  water_price_id                    varchar(255) not null
);

alter table public.customer
  owner to postgres;

create table public.bill
(
  bill_name            varchar(255) not null,
  export_address       varchar(255) not null,
  note                 varchar(255),
  customer_customer_id varchar(255) not null
    primary key
    constraint fkgyrd47ch48jc8rkya5r5e5t9y
      references public.customer
);

alter table public.bill
  owner to postgres;

create table public.water_usage_contract
(
  contract_id          varchar(255) not null
    primary key,
  appendix             jsonb,
  created_at           timestamp(6) not null,
  form_code            varchar(255) not null
    constraint uksw7dgrq62u722rxtmt7aurx6i
      unique,
  form_number          varchar(255) not null,
  representative       jsonb,
  updated_at           timestamp(6) not null,
  customer_customer_id varchar(255)
    constraint ukfj7clu6vnl01ucvn75sdsc6c5
      unique
    constraint fkhkvv0d391ffy1gndonpy5k0p1
      references public.customer
);

alter table public.water_usage_contract
  owner to postgres;

