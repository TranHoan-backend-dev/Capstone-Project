create table public.customer
(
  customer_id                       varchar(255) not null
    primary key,
  bank_account_name                 varchar(255) not null,
  bank_account_number               varchar(255) not null,
  bank_account_provider_location    varchar(255) not null,
  budget_relationship_code          varchar(255),
  cancel_reason                     varchar(255),
  citizen_identification_number     varchar(255) not null
    constraint ukru4us4m112gi4pct098d7qegf
            unique,
  citizen_identification_provide_at varchar(255) not null,
  connection_point                  varchar(255),
  cost_estimation_id                varchar(255) not null,
  created_at                        timestamp(6) not null,
  deduction_period                  varchar(255),
  email                             varchar(255) not null,
  fix_rate                          varchar(255),
  household_registration_number     integer      not null,
  installation_fee                  integer,
  installation_form_id              varchar(255) not null,
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
  settlement_id                     varchar(255) not null,
  type                              varchar(255) not null,
  updated_at                        timestamp(6) not null,
  usage_target                      varchar(255) not null,
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

create table public.installation_contract
(
  contract_id          varchar(255) not null
    primary key,
  created_at           timestamp(6) not null,
  installation_form_id varchar(255),
  updated_at           timestamp(6) not null,
  customer_customer_id varchar(255)
    constraint ukscxj09lwaj3kt2wdbfiyalyt3
            unique
        constraint fksdmkc0o24x7nmdh70kywffks3
            references public.customer
);

alter table public.installation_contract
  owner to postgres;

