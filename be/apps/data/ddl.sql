-- drop database if exists microservice;
--
-- create database microservice;

CREATE EXTENSION IF NOT EXISTS unaccent;

-- Auth
DROP TABLE IF EXISTS public.water_usage_contract CASCADE;
create table public.water_usage_contract
(
  contract_id    varchar(255) not null  -- Unique identifier for the contract
    primary key,
  appendix       jsonb,                 -- Additional contract details or appendices in JSON format
  created_at     timestamp(6) not null, -- Timestamp when the contract was created
  form_code      varchar(255) not null  -- Unique code associated with the form
    constraint uksw7dgrq62u722rxtmt7aurx6i
      unique,
  form_number    varchar(255) not null  -- Unique number assigned to the form
    constraint ukpu9g0tyj9sdsoxfdiy6ar2c8a
      unique,
  representative jsonb,                 -- JSON data storing information about the contract representative
  updated_at     timestamp(6) not null  -- Timestamp when the contract was last updated
);

DROP TABLE IF EXISTS public.customer CASCADE;
create table public.customer
(
  customer_id                       varchar(255) not null  -- Unique identifier for the customer
    primary key,
  address                           varchar(255) not null, -- Physical address of the customer
  bank_account_name                 varchar(255) not null, -- Name of the bank account holder
  bank_account_number               varchar(255) not null, -- Bank account number for transactions
  bank_account_provider_location    varchar(255) not null, -- Branch or location of the bank provider
  budget_relationship_code          varchar(255),          -- Code indicating the budget relationship
  cancel_reason                     varchar(255),          -- Reason for cancellation if the service is terminated
  citizen_identification_number     varchar(255) not null, -- Citizen ID or National ID number
  citizen_identification_provide_at varchar(255) not null, -- Location/Date where the citizen ID was issued
  connection_point                  varchar(255),          -- Point of connection to the water supply
  created_at                        timestamp(6) not null, -- Timestamp when the customer record was created
  deduction_period                  varchar(255),          -- Time period for deductions/payments
  email                             varchar(255) not null, -- Customer's email address
  fix_rate                          varchar(255),          -- Fixed billing rate if applicable
  form_code                         varchar(255) not null  -- Code from the registration form
    constraint ukmcy3y2nfbclxl4b7u6gu6f1j
      unique,
  form_number                       varchar(255) not null  -- Number from the registration form
    constraint uks5yfc8jitbpmhx96bq4v8affr
      unique,
  household_registration_number     integer      not null, -- Number from the household registration book
  installation_fee                  integer,               -- Fee charged for the initial installation
  is_active                         boolean      not null, -- Flag indicating if the customer is active
  is_big_customer                   boolean      not null, -- Flag indicating if the customer is a large-scale consumer
  is_free                           boolean,               -- Flag indicating if the customer is exempt from certain fees
  is_sale                           boolean,               -- Flag indicating if a sale/discount is applied
  m3sale                            varchar(255),          -- Volume limit or criteria for sale rates
  monthly_rent                      integer,               -- Monthly rental fee for the water meter
  name                              varchar(255) not null, -- Full name of the customer
  number_of_households              integer      not null, -- Total number of households using this connection
  passport_code                     varchar(255),          -- Passport number if applicable
  payment_method                    varchar(255) not null, -- Preferred method of payment
  phone_number                      varchar(255) not null, -- Primary contact phone number
  protect_environment_fee           integer      not null, -- Environmental protection fee amount
  roadmap_id                        varchar(255) not null, -- ID of the assigned reading/billing roadmap
  type                              varchar(255) not null  -- Category of the customer (FAMILY or COMPANY)
    constraint customer_type_check
      check ((type)::text = ANY ((ARRAY ['FAMILY'::character varying, 'COMPANY'::character varying])::text[])),
  updated_at                        timestamp(6) not null, -- Timestamp of the last update
  usage_target                      varchar(255) not null  -- Intended use of water (DOMESTIC, COMMERCIAL, etc.)
    constraint customer_usage_target_check
      check ((usage_target)::text = ANY
             ((ARRAY ['DOMESTIC'::character varying, 'INSTITUTIONAL'::character varying, 'INDUSTRIAL'::character varying, 'COMMERCIAL'::character varying])::text[])),
  water_meter_id                    varchar(255) not null  -- Serial or ID of the installed water meter
    constraint ukiqunauxnl5hcoukea9l94ajx0
      unique,
  water_meter_type                  varchar(255) not null, -- Model or type of the water meter
  water_price_id                    varchar(255) not null, -- ID of the applicable water price tier
  contract_contract_id              varchar(255) not null  -- Reference to the water usage contract
    constraint uk7jogikiuj4g970rd9cmqw40ix
      unique
    constraint fkephc09kiw1hcg1loxnnhnwh3q
      references public.water_usage_contract
);

DROP TABLE IF EXISTS public.bill CASCADE;
create table public.bill
(
  amount_need_to_pay   varchar(255),          -- The final amount the customer is required to pay
  bill_name            varchar(255) not null, -- Descriptive name of the bill (e.g., April 2024 Bill)
  export_address       varchar(255) not null, -- Address where the bill is exported/sent
  note                 varchar(255),          -- Additional comments or notes on the bill
  pay_date             date,                  -- The date when the bill was paid
  total_amount         varchar(255),          -- Total amount before taxes or subsidies
  customer_customer_id varchar(255) not null  -- Reference to the customer who owns the bill
    primary key
    constraint fkgyrd47ch48jc8rkya5r5e5t9y
      references public.customer
);

DROP TABLE IF EXISTS public.individual_notification CASCADE;
create table public.individual_notification
(
  notification_id varchar(255)          not null, -- Unique identifier for the notification
  user_id         varchar(255)          not null, -- The user to whom the notification belongs
  is_read         boolean default false not null, -- Status: true if the notification has been read
  primary key (notification_id, user_id)
);

DROP TABLE IF EXISTS public.temp CASCADE;
create table public.temp
(
  id      integer generated by default as identity -- Primary key with auto-increment
    primary key,
  content varchar(255)                             -- Temporary text content
);

DROP TABLE IF EXISTS public.user_devices CASCADE;
create table public.user_devices
(
  id            bigint generated by default as identity -- Primary key with auto-increment
    primary key,
  device_id     varchar(255) not null,                  -- Unique identifier for the hardware/browser device
  device_info   varchar(255),                           -- Detailed information about the device (OS, Browser, etc.)
  ip_address    varchar(255),                           -- Last known IP address of the device
  is_known      boolean      not null,                  -- Flag: true if the device is trusted/verified
  last_login_at timestamp(6) not null,                  -- Timestamp of the last login from this device
  user_id       varchar(255) not null                   -- Reference to the user who owns the device
);

DROP TABLE IF EXISTS public.user_roles CASCADE;
create table public.user_roles
(
  role_id varchar(255) not null -- Unique identifier for the security role
    primary key,
  name    varchar(255) not null -- Name of the role representing a set of permissions
    constraint uk182xa1gitcxqhaq6nn3n2kmo3
      unique
    constraint user_roles_name_check
      check ((name)::text = ANY
             ((ARRAY ['IT_STAFF'::character varying, 'PLANNING_TECHNICAL_DEPARTMENT_HEAD'::character varying, 'SURVEY_STAFF'::character varying, 'ORDER_RECEIVING_STAFF'::character varying, 'FINANCE_DEPARTMENT'::character varying, 'CONSTRUCTION_DEPARTMENT_HEAD'::character varying, 'CONSTRUCTION_DEPARTMENT_STAFF'::character varying, 'BUSINESS_DEPARTMENT_HEAD'::character varying, 'METER_INSPECTION_STAFF'::character varying, 'COMPANY_LEADERSHIP'::character varying])::text[]))
);

DROP TABLE IF EXISTS public.users CASCADE;
create table public.users
(
  user_id                 varchar(255) not null  -- Unique identifier for the user
    primary key,
  created_at              timestamp(6) not null, -- Timestamp when the user account was created
  department_id           varchar(255) not null, -- ID of the department the user belongs to
  electronic_signing_url  varchar(255),          -- URL or path to the user's digital signature
  email                   varchar(255) not null  -- User's official email address
    constraint uk6dotkott2kjsp8vw4d0m25fb7
      unique,
  is_enabled              boolean      not null, -- Flag: true if the user account is active
  is_locked               boolean      not null, -- Flag: true if the user account is locked
  locked_at               timestamp(6),          -- Timestamp when the account was locked
  locked_reason           varchar(255),          -- Reason for locking the account
  updated_at              timestamp(6) not null, -- Timestamp of the last profile update
  username                varchar(255) not null  -- Unique login username
    constraint ukr43af9ap4edm43mmtq01oddj6
      unique,
  water_supply_network_id varchar(255) not null, -- ID of the water network node associated with the user
  role_id                 varchar(255)           -- Reference to the user's security role
    constraint fkh555fyoyldpyaltlb7jva35j2
      references public.user_roles
);

DROP TABLE IF EXISTS public.business_pages_of_employees CASCADE;
create table public.business_pages_of_employees
(
  page_id       varchar(255) not null, -- ID of the business dashboard page
  users_user_id varchar(255) not null  -- Reference to the associated user
    constraint fkg7u0fnqxlkw834xr6tq1fcgdr
      references public.users,
  primary key (users_user_id, page_id)
);

DROP TABLE IF EXISTS public.employee_job CASCADE;
create table public.employee_job
(
  job_id        varchar(255) not null, -- ID of the job task assigned
  users_user_id varchar(255) not null  -- Reference to the associated user
    constraint fki8amwm622upo9s9bxg8l0ofjd
      references public.users,
  primary key (users_user_id, job_id)
);

DROP TABLE IF EXISTS public.profile CASCADE;
create table public.profile
(
  user_id      varchar(255) not null -- Reference to the user account (Primary Key)
    primary key
    constraint fks14jvsf9tqrcnly0afsv0ngwv
      references public.users,
  address      varchar(255),         -- Residential address of the user
  avatar_url   varchar(255),         -- URL to the user's avatar image
  birthday     date,                 -- User's date of birth
  gender       boolean,              -- User's gender (e.g., true for Male, false for Female)
  phone_number varchar(255) not null -- Unique contact phone number
    constraint ukrc7r62u5tals0tl5rkeyyo5sb
      unique
);

DROP TABLE IF EXISTS public.verification_codes CASCADE;
create table public.verification_codes
(
  email               varchar(255) not null  -- Targeted email for verification (Primary Key)
    primary key,
  attempt_count       integer      not null, -- Number of consecutive failed attempts
  blocked_until       timestamp(6),          -- Time until which the user is restricted from requesting codes
  expired_at          timestamp(6) not null, -- Time when the verification code expires
  last_generated_time timestamp(6),          -- Timestamp of when the last code was sent
  otp_code            varchar(255) not null  -- The generated One-Time Password
);

DROP TABLE IF EXISTS public.commune CASCADE;
create table public.commune
(
  commune_id  varchar(255) not null  -- Unique identifier for the commune
    primary key,
  created_at  timestamp(6) not null, -- Timestamp of record creation
  name        varchar(255) not null  -- Official name of the commune
    constraint ukn3jywsvnfyd63plqb3hkruu6x
      unique,
  name_search varchar(255),          -- Normalized name used for search optimization
  type        varchar(255) not null  -- Administrative type (e.g., URBAN_WARD)
    constraint commune_type_check
      check ((type)::text = ANY
             ((ARRAY ['URBAN_WARD'::character varying, 'RURAL_COMMUNE'::character varying])::text[])),
  updated_at  timestamp(6) not null  -- Timestamp of last update
);

DROP TABLE IF EXISTS public.hamlet CASCADE;
create table public.hamlet
(
  hamlet_id  varchar(255) not null  -- Unique identifier for the hamlet
    primary key,
  created_at timestamp(6) not null, -- Timestamp of record creation
  name       varchar(255) not null  -- Official name of the hamlet
    constraint ukg4hiqr6ln2dg5ih0m61pysgxk
      unique,
  type       varchar(255) not null  -- Administrative type (e.g., HAMLET)
    constraint hamlet_type_check
      check ((type)::text = ANY ((ARRAY ['HAMLET'::character varying, 'VILLAGE'::character varying])::text[])),
  updated_at timestamp(6) not null, -- Timestamp of last update
  commune_id varchar(255)           -- Reference to the parent commune
    constraint fkkogj6xatjfux0muqtijayk7l6
      references public.commune
);

DROP TABLE IF EXISTS public.neighborhood_unit CASCADE;
create table public.neighborhood_unit
(
  unit_id    varchar(255) not null  -- Unique identifier for the neighborhood unit
    primary key,
  created_at timestamp(6) not null, -- Timestamp of record creation
  name       varchar(255) not null  -- Official name of the neighborhood unit
    constraint uksjde4p5vuaxgd9pw5l3qcyy2t
      unique,
  updated_at timestamp(6) not null, -- Timestamp of last update
  commune_id varchar(255)           -- Reference to the parent commune
    constraint fk44wassxu1tvwdtm95v3xt7r4o
      references public.commune
);

DROP TABLE IF EXISTS public.road CASCADE;
create table public.road
(
  road_id    varchar(255) not null  -- Unique identifier for the road
    primary key,
  created_at timestamp(6) not null, -- Timestamp of record creation
  name       varchar(255) not null  -- Official name of the road
    constraint ukmucrx2d2ypmdj5b8p47at2u23
      unique,
  updated_at timestamp(6) not null  -- Timestamp of last update
);

DROP TABLE IF EXISTS public.water_supply_network CASCADE;
create table public.water_supply_network
(
  branch_id  varchar(255) not null  -- Unique identifier for the network branch
    primary key,
  created_at timestamp(6) not null, -- Timestamp of record creation
  name       varchar(255) not null  -- Name of the water supply network branch
    constraint ukaw3rdl4uk0cqcyo9v1yu2v8de
      unique,
  updated_at timestamp(6) not null  -- Timestamp of last update
);

DROP TABLE IF EXISTS public.installation_form CASCADE;
create table public.installation_form
(
  form_code                               varchar(255) not null, -- Part of composite PK: Code identifying the form category
  form_number                             varchar(36)  not null, -- Part of composite PK: Sequence number of the form
  address                                 varchar(255) not null, -- Site address where installation is requested
  bank_account_number                     varchar(255) not null, -- Bank info for billing purposes
  bank_account_provider_location          varchar(255) not null, -- Branch/Location of the bank
  citizen_identification_number           varchar(12)  not null, -- National ID of the applicant
  citizen_identification_provide_date     varchar(255) not null, -- Issue date of the ID
  citizen_identification_provide_location varchar(255) not null, -- Issuing authority of the ID
  constructed_by                          varchar(255),          -- ID of the staff member assigned to construction
  created_at                              timestamp(6) not null, -- Timestamp of form creation
  created_by                              varchar(255) not null, -- ID of the staff member who created the form
  customer_name                           varchar(255) not null, -- Name of the applicant/customer
  customer_type                           varchar(255) not null  -- Category of customer (FAMILY/COMPANY)
    constraint installation_form_customer_type_check
      check ((customer_type)::text = ANY
             ((ARRAY ['FAMILY'::character varying, 'COMPANY'::character varying])::text[])),
  handover_by                             varchar(255),          -- ID of the staff member who approved/handed over
  household_registration_number           integer      not null, -- Household registration book ID
  number_of_household                     integer      not null, -- Total households served by this request
  overall_water_meter_id                  varchar(255) not null, -- ID of the master meter assigned
  phone_number                            varchar(10)  not null, -- Applicant's contact phone number
  received_form_at                        date         not null, -- Date when the application was formally received
  representative                          jsonb,                 -- JSON data for authorized representatives
  schedule_survey_at                      date,                  -- Planned date for site survey
  status                                  jsonb        not null, -- JSON object tracking processing status stages
  tax_code                                varchar(255),          -- Tax ID if the applicant is a company
  updated_at                              timestamp(6) not null, -- Timestamp of last update
  usage_target                            varchar(255) not null  -- Purpose of water use (DOMESTIC, COMMERCIAL, etc.)
    constraint installation_form_usage_target_check
      check ((usage_target)::text = ANY
             ((ARRAY ['DOMESTIC'::character varying, 'INSTITUTIONAL'::character varying, 'INDUSTRIAL'::character varying, 'COMMERCIAL'::character varying])::text[])),
  water_supply_network_id                 varchar(255) not null  -- ID of the target network node
    constraint fkqyc815wmilxlmy6uksjqadjdl
      references public.water_supply_network,
  primary key (form_code, form_number)
);

DROP TABLE IF EXISTS public.construction_request CASCADE;
create table public.construction_request
(
  id                       varchar(255) not null  -- Unique identifier for the construction request
    primary key,
  contract_id              varchar(255) not null, -- Associated water usage contract ID
  created_at               timestamp(6) not null, -- Timestamp of request creation
  updated_at               timestamp(6) not null, -- Timestamp of last update
  installation_form_code   varchar(255) not null, -- Part of composite FK to installation form
  installation_form_number varchar(36)  not null, -- Part of composite FK to installation form
  constraint uk1b5eco0tb0sga1jtlcf3tl6q5
    unique (installation_form_code, installation_form_number),
  constraint fkkug80rkby27swt0vkefpcvagk
    foreign key (installation_form_code, installation_form_number) references public.installation_form
);

DROP TABLE IF EXISTS public.cost_estimate CASCADE;
create table public.cost_estimate
(
  estimation_id                      varchar(255) not null  -- Unique identifier for the cost estimate
    primary key,
  address                            varchar(255) not null, -- Address of the construction site
  construction_machinery_coefficient integer,               -- Multiplier coefficient for machinery expenses
  contract_fee                       integer,               -- Base fee for the legal contract
  create_by                          varchar(255) not null, -- ID of the employee who created the estimate
  created_at                         timestamp(6) not null, -- Timestamp of record creation
  customer_name                      varchar(255) not null, -- Name of the customer from the estimate
  design_coefficient                 integer,               -- Multiplier coefficient for design complexity
  design_fee                         integer,               -- Calculated fee for design work
  design_image_url                   varchar(255),          -- URL link to the blueprint/design image
  general_cost_coefficient           integer,               -- Multiplier coefficient for general overhead costs
  installation_fee                   integer,               -- Base fee for labor/installation services
  labor_coefficient                  integer,               -- Multiplier coefficient for specific labor conditions
  note                               varchar(255),          -- Additional comments or remarks
  overall_water_meter_id             varchar(255) not null, -- Serial/ID of the physical meter to be installed
  precalculated_tax_coefficient      integer,               -- Anticipated tax multiplier
  registration_at                    date         not null, -- Date the estimate was officially registered
  significance                       jsonb,                 -- JSON data for approval signatures and workflow
  survey_effort                      integer,               -- Calculated number of work hours for the site survey
  survey_fee                         integer,               -- Calculated charges for site inspection
  updated_at                         timestamp(6) not null, -- Timestamp of last update
  vat_coefficient                    integer,               -- Multiplier for value-added tax
  water_meter_serial                 varchar(255),          -- Serial number of the water meter
  water_meter_type_id                varchar(255),          -- ID of the specific meter model used
  installation_form_code             varchar(255) not null, -- Referral installation form code
  installation_form_number           varchar(36)  not null, -- Referral installation form sequence number
  constraint ukamtlfn0i9qita6f19cpjnukbu
    unique (installation_form_code, installation_form_number),
  constraint fknaj1grv44mei10qol1oql3m80
    foreign key (installation_form_code, installation_form_number) references public.installation_form
);

DROP TABLE IF EXISTS public.laterals CASCADE;
create table public.laterals
(
  lateral_id              varchar(255) not null  -- Unique identifier for the pipe lateral
    primary key,
  created_at              timestamp(6) not null, -- Timestamp of creation
  name                    varchar(255) not null  -- Unique name or path of the lateral
    constraint uk8tcdg3nw5kepopyujyq1fg5ww
      unique,
  updated_at              timestamp(6) not null, -- Timestamp of last update
  water_supply_network_id varchar(255) not null  -- ID of the parent network branch
    constraint fknd58hto6lft7ym4q37l1mo882
      references public.water_supply_network
);

DROP TABLE IF EXISTS public.receipt CASCADE;
create table public.receipt
(
  address                       varchar(255) not null, -- Site or billing address
  attach                        varchar(255),          -- Link to supporting documents or scan of the physical receipt
  created_at                    timestamp(6) not null, -- Timestamp of receipt generation
  customer_name                 varchar(255) not null, -- Subject who completed the payment
  is_paid                       boolean      not null, -- Status: true if payment is confirmed
  payment_date                  date         not null, -- Official transaction date
  payment_reason                varchar(255) not null, -- Category description of the payment
  receipt_number                varchar(255) not null, -- Official sequence number from the receipt book
  significance                  jsonb,                 -- Approval/Processing metadata in JSON
  total_money_in_characters     varchar(255),          -- Amount worded out in textual format
  total_money_in_digits         varchar(255) not null, -- Standardized numerical value of payment
  updated_at                    timestamp(6) not null, -- Timestamp of last update
  installation_form_form_code   varchar(255) not null, -- Part of composite PK/FK: installation form
  installation_form_form_number varchar(36)  not null, -- Part of composite PK/FK: form sequence
  primary key (installation_form_form_code, installation_form_form_number),
  constraint fkjwvoi10c5ywsbf652cxlsp58s
    foreign key (installation_form_form_code, installation_form_form_number) references public.installation_form
);

DROP TABLE IF EXISTS public.roadmap CASCADE;
create table public.roadmap
(
  roadmap_id              varchar(255) not null  -- Unique identifier for the reading/billing route
    primary key,
  assigned_staff_id       varchar(255),          -- ID of the staff assigned to this reading route
  created_at              timestamp(6) not null, -- Timestamp of route creation
  name                    varchar(255) not null  -- Unique name of the roadmap
    constraint uken8xqs8c9yv3lca2n3wdk93fp
      unique,
  updated_at              timestamp(6) not null, -- Timestamp of last update
  lateral_id              varchar(255) not null  -- ID of the associated lateral branch
    constraint fkoedg1n2o1rlegyb2bfy6ll60k
      references public.laterals,
  water_supply_network_id varchar(255) not null  -- ID of the parent network node
    constraint fk39pm43hgtx23mxi4t7a6w8m25
      references public.water_supply_network
);

DROP TABLE IF EXISTS public.settlement CASCADE;
create table public.settlement
(
  settlement_id            varchar(255)   not null  -- Unique identifier for the financial settlement document
    primary key,
  address                  varchar(255)   not null, -- Site address of final construction
  connection_fee           numeric(19, 2) not null, -- Final connection/installation fee confirmed
  created_at               timestamp(6)   not null, -- Timestamp of record creation
  job_content              varchar(255)   not null, -- Summary of actual tasks performed
  note                     varchar(255)   not null, -- Auditor's remarks or final notes
  registration_at          date           not null, -- Official registration date of the settlement
  significance             jsonb,                   -- JSON data for audit signatures
  updated_at               timestamp(6)   not null, -- Timestamp of last update
  installation_form_code   varchar(255)   not null, -- Referral installation form code
  installation_form_number varchar(36)    not null, -- Referral installation form sequence number
  constraint ukoq0jl8wc17mev4yyc7k8c1tj9
    unique (installation_form_code, installation_form_number),
  constraint fkbbtustw4v4e547691oqm90lx6
    foreign key (installation_form_code, installation_form_number) references public.installation_form
);

DROP TABLE IF EXISTS public.materials_group CASCADE;
create table public.materials_group
(
  group_id   varchar(255) not null  -- Unique identifier for the material category
    primary key,
  created_at timestamp(6) not null, -- Timestamp of creation
  name       varchar(255) not null  -- Descriptive name of the material group (Pipes, Valves, etc.)
    constraint ukp5q73e1ej9oy70w2tvbl2502u
      unique,
  updated_at timestamp(6) not null  -- Timestamp of last update
);

DROP TABLE IF EXISTS public.overall_water_meter CASCADE;
create table public.overall_water_meter
(
  serial     varchar(255) not null  -- Physical serial number of the master meter (Primary Key)
    primary key,
  lateral_id varchar(255) not null, -- ID of the lateral branch where this meter is installed
  name       varchar(255) not null  -- Unique label/name for the master meter
    constraint ukb3dd1t3sdcwe8sbqfrf9dfyif
      unique
);

DROP TABLE IF EXISTS public.parameters CASCADE;
create table public.parameters
(
  param_id   varchar(255)   not null  -- Unique identifier for the system configuration parameter
    primary key,
  created_at timestamp(6)   not null, -- Timestamp of version start
  creator    varchar(255)   not null, -- ID of the user who defined the setting
  name       varchar(255)   not null  -- Key name of the parameter (e.g., TAX_RATE)
    constraint uk103wr298mpbr2vhx5tr7ila1o
      unique,
  updated_at timestamp(6)   not null, -- Timestamp of last change
  updator    varchar(255)   not null, -- ID of the user who last modified the setting
  value      numeric(38, 2) not null  -- Configured numerical value
);

DROP TABLE IF EXISTS public.price_type CASCADE;
create table public.price_type
(
  price_type_id varchar(255) not null  -- ID for the tiered price category (Primary Key)
    primary key,
  area          varchar(255) not null, -- Geographic area under this pricing scheme
  price         jsonb        not null  -- JSON array of rate steps/tiers
);

DROP TABLE IF EXISTS public.unit CASCADE;
create table public.unit
(
  unit_id    varchar(255) not null  -- Unique identifier for the unit of measure
    primary key,
  created_at timestamp(6) not null, -- Timestamp of creation
  name       varchar(255) not null  -- Universal name (Kg, Meter, Set, etc.)
    constraint ukaa58c9de9eu0v585le47w25my
      unique,
  updated_at timestamp(6) not null  -- Timestamp of last update
);

DROP TABLE IF EXISTS public.material CASCADE;
create table public.material
(
  material_id                                   varchar(255)   not null  -- Unique ID for the construction item (Primary Key)
    primary key,
  construction_machinery_price                  numeric(19, 2) not null, -- Unit machinery use cost (Urban)
  construction_machinery_price_at_rural_commune numeric(19, 2) not null, -- Unit machinery use cost (Rural)
  created_at                                    timestamp(6)   not null, -- Creation timestamp
  job_content                                   text           not null, -- Description of typical usage/task
  labor_code                                    text           not null, -- Code for associated labor skill category
  labor_price                                   numeric(19, 2) not null, -- Unit labor cost (Urban)
  labor_price_at_rural_commune                  numeric(19, 2) not null, -- Unit labor cost (Rural)
  price                                         numeric(19, 2) not null, -- Standard unit acquisition price
  updated_at                                    timestamp(6)   not null, -- Modification timestamp
  materials_group_id                            varchar(255)   not null  -- ID of the associated materials category
    constraint fkkhf9spu3aq8udmyyq8s5rmeio
      references public.materials_group,
  calculation_unit_id                           varchar(255)   not null  -- ID of the associated unit of measurement
    constraint fkbvkkik21h23aisjcbbpgafst6
      references public.unit
);

DROP TABLE IF EXISTS public.materials_of_cost_estimate CASCADE;
create table public.materials_of_cost_estimate
(
  cost_est_id          varchar(255) not null, -- Reference to the Cost Estimate header
  mass                 real         not null, -- Required quantity/mass
  note                 varchar(255),          -- Specific line item notes
  total_labor_cost     varchar(255),          -- Subtotal of labor costs for this item
  total_material_cost  varchar(255),          -- Subtotal of material costs for this item
  material_material_id varchar(255) not null  -- ID of the underlying material catalog item
    constraint fk8hlrkyr0pdjjk5yooog6ewvin
      references public.material,
  primary key (cost_est_id, material_material_id)
);

DROP TABLE IF EXISTS public.materials_of_settlement CASCADE;
create table public.materials_of_settlement
(
  settlement_id        varchar(255) not null, -- Reference to the Settlement header
  labor_cost           varchar(255),          -- Actual post-construction labor cost
  mass                 real         not null, -- Actual quantity used
  material_cost        varchar(255),          -- Actual post-construction material cost
  note                 varchar(255),          -- Discrepancy or audit notes
  material_material_id varchar(255) not null  -- ID of the underlying material catalog item
    constraint fkaueyvhmdiruotg5pccb1bpaou
      references public.material,
  primary key (material_material_id, settlement_id)
);

DROP TABLE IF EXISTS public.water_meter_type CASCADE;
create table public.water_meter_type
(
  type_id     varchar(255) not null  -- System ID for the water meter model (Primary Key)
    primary key,
  created_at  timestamp(6) not null, -- Timestamp of record creation
  diameter    real,                  -- Physical diameter of the aperture (mm)
  max_index   varchar(255),          -- Maximum readable value on the register
  meter_model varchar(255) not null, -- Manufacturer's model designation
  name        varchar(255) not null, -- Human-readable model name
  origin      varchar(255) not null, -- Country where the device was manufactured
  qmin        varchar(255),          -- Detection limit threshold (Minimum)
  qn          varchar(255),          -- Detection limit threshold (Nominal)
  qt          varchar(255),          -- Detection limit threshold (Transitional)
  size        integer,               -- Commercial size code
  index_length integer,               -- Number of integer digits (black characters)
  updated_at  timestamp(6) not null  -- Timestamp of last update
);

DROP TABLE IF EXISTS public.water_meter CASCADE;
create table public.water_meter
(
  meter_id            varchar(255) not null  -- Physical serial or tracked ID of the meter instance
    primary key,
  installation_date   date         not null, -- Date when the specific unit was field-installed
  size                integer      not null, -- Dimension size code for this unit
  water_meter_type_id varchar(255) not null  -- Reference to technical specifications (WaterMeterType)
    constraint fk918g3f2rs9p2b4uujx5h01kiq
      references public.water_meter_type
);

DROP TABLE IF EXISTS public.usage_history CASCADE;
create table public.usage_history
(
  customer_id varchar(255) not null -- ID of the subject customer (Unique)
    constraint uk7bgg9a3lubti663eagw8kamso
      unique,
  usages      jsonb,                -- JSON array of reading snapshots (index, volume, etc.)
  meter_code  varchar(255) not null -- Serial reference (Primary Key)
    primary key
    constraint fkrxiqn18008bmpbc73g3acvm3o
      references public.water_meter
);

DROP TABLE IF EXISTS public.water_price CASCADE;
create table public.water_price
(
  price_id           varchar(255)   not null  -- ID of the pricing tariff document (Primary Key)
    primary key,
  application_period date           not null, -- Start date of validity for these rates
  created_at         timestamp(6)   not null, -- Document creation timestamp
  description        varchar(255)   not null  -- Unique name of the tariff revision
    constraint uk96vl1pb7ei7mnv3c2n0d1ym20
      unique,
  environment_price  numeric(38, 2),          -- Mandatory environmental protection tax value
  expiration_date    date           not null, -- End date of validity for these rates
  tax                numeric(38, 2) not null, -- VAT or other applicable tax rate
  updated_at         timestamp(6)   not null, -- Last modification timestamp
  usage_target       varchar(255)   not null  -- Purpose of usage (DOMESTIC, etc.)
    constraint water_price_usage_target_check
      check ((usage_target)::text = ANY
             ((ARRAY ['DOMESTIC'::character varying, 'INSTITUTIONAL'::character varying, 'INDUSTRIAL'::character varying, 'COMMERCIAL'::character varying])::text[]))
);

DROP TABLE IF EXISTS public.water_price_price_types CASCADE;
create table public.water_price_price_types
(
  water_price_price_id      varchar(255) not null -- Referral ID for the WaterPrice tariff header
    constraint fkhgabkm67kgm264uwq6shrfw7r
      references public.water_price,
  price_types_price_type_id varchar(255) not null -- Referral ID for individual tiered PriceTypes
    constraint fkdb51bbihy0304wg8eg4omfu1i
      references public.price_type
);

DROP TABLE IF EXISTS public.business_page CASCADE;
create table public.business_page
(
  page_id  varchar(255) not null  -- Code identifying a specific dashboard module/page (Primary Key)
    primary key,
  activate boolean      not null, -- Global visibility toggle for the page
  creator  varchar(255) not null, -- ID of the user who registered the page route
  name     varchar(255) not null  -- Unique name label for the page
    constraint ukd95s8n40xd5gu8nf7k5beq3l0
      unique,
  updator  varchar(255) not null  -- ID of the user who last changed the page config
);

DROP TABLE IF EXISTS public.department CASCADE;
create table public.department
(
  department_id varchar(255) not null -- Unique identifier for the department (Primary Key)
    primary key,
  name          varchar(255) not null -- Official name of the department
    constraint uk1t68827l97cwyxo9r1u6t4p7d
      unique,
  phone_number  varchar(255)          -- Official contact number for the unit
    constraint uk3xtr67uls6rn1u4qy6iy68ffo
      unique
);

DROP TABLE IF EXISTS public.job CASCADE;
create table public.job
(
  job_id     varchar(255) not null  -- Unique identifier for the job title (Primary Key)
    primary key,
  created_at timestamp(6) not null, -- Record creation timestamp
  name       varchar(255) not null  -- Official title of the role
    constraint ukatcl7ldp04r846fq0cep4e3wi
      unique,
  updated_at timestamp(6) not null  -- Last modification timestamp
);
