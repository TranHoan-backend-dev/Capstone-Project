CREATE EXTENSION IF NOT EXISTS unaccent;

create table public.commune
(
  commune_id  varchar(255) not null
    primary key,
  created_at  timestamp(6) not null,
  name        varchar(255) not null
    constraint ukn3jywsvnfyd63plqb3hkruu6x
      unique,
  name_search varchar(255),
  type        varchar(255) not null
    constraint commune_type_check
      check ((type)::text = ANY
             ((ARRAY ['URBAN_WARD'::character varying, 'RURAL_COMMUNE'::character varying])::text[])),
  updated_at  timestamp(6) not null
);

alter table public.commune
  owner to postgres;

create table public.hamlet
(
  hamlet_id  varchar(255) not null
    primary key,
  created_at timestamp(6) not null,
  name       varchar(255) not null
    constraint ukg4hiqr6ln2dg5ih0m61pysgxk
      unique,
  type       varchar(255) not null
    constraint hamlet_type_check
      check ((type)::text = ANY ((ARRAY ['HAMLET'::character varying, 'VILLAGE'::character varying])::text[])),
  updated_at timestamp(6) not null,
  commune_id varchar(255)
    constraint fkkogj6xatjfux0muqtijayk7l6
      references public.commune
);

alter table public.hamlet
  owner to postgres;

create table public.neighborhood_unit
(
  unit_id    varchar(255) not null
    primary key,
  created_at timestamp(6) not null,
  name       varchar(255) not null
    constraint uksjde4p5vuaxgd9pw5l3qcyy2t
      unique,
  updated_at timestamp(6) not null,
  commune_id varchar(255)
    constraint fk44wassxu1tvwdtm95v3xt7r4o
      references public.commune
);

alter table public.neighborhood_unit
  owner to postgres;

create table public.road
(
  road_id    varchar(255) not null
    primary key,
  created_at timestamp(6) not null,
  name       varchar(255) not null
    constraint ukmucrx2d2ypmdj5b8p47at2u23
      unique,
  updated_at timestamp(6) not null
);

alter table public.road
  owner to postgres;

create table public.water_supply_network
(
  branch_id  varchar(255) not null
    primary key,
  created_at timestamp(6) not null,
  name       varchar(255) not null
    constraint ukaw3rdl4uk0cqcyo9v1yu2v8de
      unique,
  updated_at timestamp(6) not null
);

alter table public.water_supply_network
  owner to postgres;

create table public.installation_form
(
  form_code                               varchar(255) not null,
  form_number                             varchar(36)  not null,
  address                                 varchar(255) not null,
  bank_account_number                     varchar(255) not null,
  bank_account_provider_location          varchar(255) not null,
  citizen_identification_number           varchar(12)  not null,
  citizen_identification_provide_date     varchar(255) not null,
  citizen_identification_provide_location varchar(255) not null,
  constructed_by                          varchar(255),
  created_at                              timestamp(6) not null,
  created_by                              varchar(255) not null,
  customer_name                           varchar(255) not null,
  customer_type                           varchar(255) not null
    constraint installation_form_customer_type_check
      check ((customer_type)::text = ANY
             ((ARRAY ['FAMILY'::character varying, 'COMPANY'::character varying])::text[])),
  handover_by                             varchar(255),
  household_registration_number           integer      not null,
  number_of_household                     integer      not null,
  overall_water_meter_id                  varchar(255) not null,
  phone_number                            varchar(10)  not null,
  received_form_at                        date         not null,
  representative                          jsonb,
  schedule_survey_at                      date,
  status                                  jsonb        not null,
  tax_code                                varchar(255),
  updated_at                              timestamp(6) not null,
  usage_target                            varchar(255) not null
    constraint installation_form_usage_target_check
      check ((usage_target)::text = ANY
             ((ARRAY ['DOMESTIC'::character varying, 'INSTITUTIONAL'::character varying, 'INDUSTRIAL'::character varying, 'COMMERCIAL'::character varying])::text[])),
  water_supply_network_id                 varchar(255)
    constraint fkqyc815wmilxlmy6uksjqadjdl
      references public.water_supply_network,
  primary key (form_code, form_number)
);

alter table public.installation_form
  owner to postgres;

create table public.construction_request
(
  id                            varchar(255) not null
    primary key,
  contract_id                   varchar(255) not null,
  created_at                    timestamp(6) not null,
  updated_at                    timestamp(6) not null,
  installation_form_form_code   varchar(255),
  installation_form_form_number varchar(36),
    status varchar(255) not null
        constraint settlement_status_check
        check ((status)::text = ANY ((ARRAY ['PROCESSING', 'PENDING_FOR_APPROVAL', 'APPROVED', 'REJECTED'])::text[])),
  constraint uk3l14rwso7ddv5c1nrfvjs4fka
    unique (installation_form_form_code, installation_form_form_number),
  constraint fkcw1o1cf9l9e3x8w0cp5leitop
    foreign key (installation_form_form_code, installation_form_form_number) references public.installation_form
);

alter table public.construction_request
  owner to postgres;

create table public.cost_estimate
(
  estimation_id                      varchar(255) not null
    primary key,
  address                            varchar(255) not null,
  construction_machinery_coefficient integer,
  contract_fee                       integer,
  create_by                          varchar(255) not null,
  created_at                         timestamp(6) not null,
  customer_name                      varchar(255) not null,
  design_coefficient                 integer,
  design_fee                         integer,
  design_image_url                   varchar(255),
  general_cost_coefficient           integer,
  installation_fee                   integer,
  labor_coefficient                  integer,
  note                               varchar(255),
  overall_water_meter_id             varchar(255) not null,
  precalculated_tax_coefficient      integer,
  registration_at                    date         not null,
  significance                       jsonb,
  survey_effort                      integer,
  survey_fee                         integer,
  updated_at                         timestamp(6) not null,
  vat_coefficient                    integer,
  water_meter_serial                 varchar(255),
  installation_form_form_code        varchar(255),
  installation_form_form_number      varchar(36),
  constraint ukoxhdwqay1l4rf08vh8ox7iuou
    unique (installation_form_form_code, installation_form_form_number),
  constraint fkd0hrmii0s9vndliepsyjr4y1k
    foreign key (installation_form_form_code, installation_form_form_number) references public.installation_form
);

alter table public.cost_estimate
  owner to postgres;

create table public.laterals
(
  lateral_id              varchar(255) not null
    primary key,
  created_at              timestamp(6) not null,
  name                    varchar(255) not null
    constraint uk8tcdg3nw5kepopyujyq1fg5ww
      unique,
  updated_at              timestamp(6) not null,
  water_supply_network_id varchar(255)
    constraint fknd58hto6lft7ym4q37l1mo882
      references public.water_supply_network
);

alter table public.laterals
  owner to postgres;

create table public.receipt
(
  address                       varchar(255) not null,
  created_at                    timestamp(6) not null,
  customer_name                 varchar(255) not null,
  is_paid                       boolean      not null,
  payment_date                  date         not null,
  receipt_number                varchar(255) not null,
  updated_at                    timestamp(6) not null,
  installation_form_form_code   varchar(255) not null,
  installation_form_form_number varchar(36)  not null,
  primary key (installation_form_form_code, installation_form_form_number),
  constraint fkjwvoi10c5ywsbf652cxlsp58s
    foreign key (installation_form_form_code, installation_form_form_number) references public.installation_form
);

alter table public.receipt
  owner to postgres;

create table public.roadmap
(
  roadmap_id              varchar(255) not null
    primary key,
  created_at              timestamp(6) not null,
  name                    varchar(255) not null
    constraint uken8xqs8c9yv3lca2n3wdk93fp
      unique,
  updated_at              timestamp(6) not null,
  lateral_id              varchar(255)
    constraint fkoedg1n2o1rlegyb2bfy6ll60k
      references public.laterals,
  water_supply_network_id varchar(255)
    constraint fk39pm43hgtx23mxi4t7a6w8m25
      references public.water_supply_network
);

alter table public.roadmap
  owner to postgres;

create table public.settlement
(
  settlement_id                 varchar(255)   not null
    primary key,
  address                       varchar(255)   not null,
  connection_fee                numeric(19, 2) not null,
  created_at                    timestamp(6)   not null,
  job_content                   varchar(255)   not null,
  note                          varchar(255)   not null,
  registration_at               date           not null,
  significance                  jsonb,
  updated_at                    timestamp(6)   not null,
  installation_form_form_code   varchar(255),
  installation_form_form_number varchar(36),
    status varchar(255) not null
        constraint settlement_status_check
        check ((status)::text = ANY ((ARRAY ['PROCESSING', 'PENDING_FOR_APPROVAL', 'APPROVED', 'REJECTED'])::text[])),
  constraint uka16ybuafkf2crgemm1nivc0hs
    unique (installation_form_form_code, installation_form_form_number),
  constraint fk7glq90muysfwma3d7swfrx0gh
    foreign key (installation_form_form_code, installation_form_form_number) references public.installation_form
);

alter table public.settlement
  owner to postgres;
