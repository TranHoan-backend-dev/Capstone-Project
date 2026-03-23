package com.capstone.customer.service.impl;

import com.capstone.common.exception.NotExistingException;
import com.capstone.common.response.WrapperApiResponse;
import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.request.customer.UpdateRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.dto.response.WaterPriceInfoResponse;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.ConstructionService;
import com.capstone.customer.service.boundary.CustomerService;
import com.capstone.customer.service.boundary.DeviceService;
import com.capstone.customer.utils.Message;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.capstone.customer.dto.request.customer.CustomerFilterRequest;
import com.capstone.customer.repository.CustomerSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerServiceImpl implements CustomerService {
  CustomerRepository customerRepository;
  DeviceService deviceService;
  ConstructionService constructionService;
  ObjectMapper objectMapper;

  @Override
  @Transactional
  public CustomerResponse createCustomer(@NonNull CreateRequest request) {
    log.info("Creating customer with email: {}", request.email());
    if (customerRepository.existsByFormCodeAndFormNumber(request.formCode(), request.formNumber())) {
      throw new IllegalArgumentException(Message.ENT_23);
    }

    var customer = Customer.create(builder -> builder
      .name(request.name())
      .email(request.email())
      .phoneNumber(request.phoneNumber())
      .type(request.type())
      .isBigCustomer(request.isBigCustomer())
      .usageTarget(request.usageTarget().name())
      .numberOfHouseholds(request.numberOfHouseholds())
      .householdRegistrationNumber(request.householdRegistrationNumber())
      .protectEnvironmentFee(request.protectEnvironmentFee())
      .waterMeterType(request.waterMeterType())
      .citizenIdentificationNumber(request.citizenIdentificationNumber())
      .citizenIdentificationProvideAt(request.citizenIdentificationProvideAt())
      .paymentMethod(request.paymentMethod())
      .bankAccountNumber(request.bankAccountNumber())
      .bankAccountProviderLocation(request.bankAccountProviderLocation())
      .bankAccountName(request.bankAccountName())
      .isActive(request.isActive() != null ? request.isActive() : true));

    setProperties2(
      customer, request.formCode(), request.formNumber(),
      request.waterPriceId(), request.waterMeterId());
    setProperties(
      customer, request.isFree(), request.isSale(), request.m3Sale(),
      request.fixRate(), request.installationFee(), request.deductionPeriod(),
      request.monthlyRent());
    setProperties1(
      customer, request.budgetRelationshipCode(), request.passportCode(),
      request.connectionPoint());

    var saved = customerRepository.save(customer);
    return mapToResponse(saved);
  }

  private void setProperties2(Customer customer, String s, String s2, String s3, String s4) {
    if (s != null && !s.isBlank() &&
      s2 != null && !s2.isBlank()) {
      var status = constructionService.checkExistence(s, s2);
      if (status) {
        throw new NotExistingException(String.format(SharedMessage.MES_24, s2, s));
      }
      customer.setFormNumber(s2);
      customer.setFormCode(s);
    }
    if (s3 != null) {
      log.info("water price: {}", !deviceService.checkExistenceOfWaterPrice(s3));
      if (!deviceService.checkExistenceOfWaterPrice(s3)) {
        throw new IllegalArgumentException(Message.ENT_28);
      }
      customer.setWaterPriceId(s3);
    }
    if (s4 != null) {
      log.info("hehe");
      log.info("water meter: {}", !deviceService.checkExistenceOfWaterMeter(s4));
      if (!deviceService.checkExistenceOfWaterMeter(s4)) {
        throw new IllegalArgumentException(Message.ENT_29);
      }
      customer.setWaterMeterId(s4);
    }
  }

  private void setProperties(Customer customer, Boolean free, Boolean sale, String s, String s2, Integer integer, String s3, Integer integer2) {
    log.info("1");
    if (free != null) {
      customer.setIsFree(free);
    }
    log.info("2");
    if (sale != null) {
      customer.setIsSale(sale);
    }
    log.info("3");
    if (s != null) {
      customer.setM3Sale(s);
    }
    log.info("4");
    if (s2 != null) {
      customer.setFixRate(s2);
    }
    log.info("5");
    if (integer != null) {
      customer.setInstallationFee(integer);
    }
    log.info("6");
    if (s3 != null) {
      customer.setDeductionPeriod(s3);
    }
    log.info("7");
    if (integer2 != null) {
      customer.setMonthlyRent(integer2);
    }
  }

  private void setProperties1(Customer customer, String s, String s2, String s3) {
    if (s != null) {
      customer.setBudgetRelationshipCode(s);
    }
    if (s2 != null) {
      customer.setPassportCode(s2);
    }
    if (s3 != null) {
      customer.setConnectionPoint(s3);
    }
  }

  @Override
  @Transactional
  public CustomerResponse updateCustomer(String id, @NonNull UpdateRequest request) {
    log.info("Updating customer with ID: {}", id);
    var customer = customerRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));

    setProperties(
      customer, request.isFree(), request.isSale(), request.m3Sale(),
      request.fixRate(), request.installationFee(), request.deductionPeriod(),
      request.monthlyRent());
    setProperties1(
      customer, request.budgetRelationshipCode(), request.passportCode(),
      request.connectionPoint());
    setProperties2(
      customer, request.formCode(), request.formNumber(),
      request.waterPriceId(), request.waterMeterId());

    if (request.name() != null) {
      customer.setName(request.name());
    }
    if (request.email() != null) {
      customer.setEmail(request.email());
    }
    if (request.phoneNumber() != null) {
      customer.setPhoneNumber(request.phoneNumber());
    }
    if (request.type() != null) {
      customer.setType(request.type());
    }
    if (request.isBigCustomer() != null) {
      customer.setIsBigCustomer(request.isBigCustomer());
    }
    if (request.usageTarget() != null) {
      customer.setUsageTarget(request.usageTarget().name());
    }
    if (request.numberOfHouseholds() != null) {
      customer.setNumberOfHouseholds(request.numberOfHouseholds());
    }
    if (request.householdRegistrationNumber() != null) {
      customer.setHouseholdRegistrationNumber(request.householdRegistrationNumber());
    }
    if (request.protectEnvironmentFee() != null) {
      customer.setProtectEnvironmentFee(request.protectEnvironmentFee());
    }
    if (request.waterMeterType() != null) {
      customer.setWaterMeterType(request.waterMeterType());
    }
    if (request.citizenIdentificationNumber() != null) {
      customer.setCitizenIdentificationNumber(request.citizenIdentificationNumber());
    }
    if (request.citizenIdentificationProvideAt() != null) {
      customer.setCitizenIdentificationProvideAt(request.citizenIdentificationProvideAt());
    }
    if (request.paymentMethod() != null) {
      customer.setPaymentMethod(request.paymentMethod());
    }
    if (request.bankAccountNumber() != null) {
      customer.setBankAccountNumber(request.bankAccountNumber());
    }
    if (request.bankAccountProviderLocation() != null) {
      customer.setBankAccountProviderLocation(request.bankAccountProviderLocation());
    }
    if (request.bankAccountName() != null) {
      customer.setBankAccountName(request.bankAccountName());
    }
    if (request.isActive() != null) {
      customer.setIsActive(request.isActive());
    }
    if (request.cancelReason() != null) {
      customer.setCancelReason(request.cancelReason());
    }
    var updated = customerRepository.save(customer);
    return mapToResponse(updated);
  }

  @Override
  @Transactional
  public void deleteCustomer(String id) {
    log.info("Deleting customer with ID: {}", id);
    if (!customerRepository.existsById(id)) {
      throw new IllegalArgumentException("Customer not found with ID: " + id);
    }
    customerRepository.deleteById(id);
  }

  @Override
  public CustomerResponse getCustomerById(String id) {
    log.info("Fetching customer with ID: {}", id);
    return customerRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));
  }

  @Override
  public Page<CustomerResponse> getAllCustomers(Pageable pageable, CustomerFilterRequest filter) {
    log.debug("Fetching all customers with pagination: {} and filter: {}", pageable, filter);
    Specification<Customer> spec = CustomerSpecification.filter(filter);
    return customerRepository.findAll(spec, pageable).map(this::mapToResponse);
  }

  @Override
  public boolean areCustomersAppliedThisPrice(String priceId) {
    log.info("Checking if customers are applied this water price: {}", priceId);
    return customerRepository.existsByWaterPriceId(priceId);
  }

  @Override
  public boolean isExistingCustomer(String id) {
    return customerRepository.existsById(id);
  }

  @Override
  public String getIdByMeterId(String meterId) {
    return customerRepository.findByWaterMeterId(meterId)
      .orElseThrow(() -> new NotExistingException("Customer not found"))
      .getCustomerId();
  }

  private @NonNull CustomerResponse mapToResponse(@NonNull Customer customer) {
    var waterPrice = resolveWaterPrice(customer.getWaterPriceId());

    return new CustomerResponse(
      customer.getCustomerId(),
      customer.getName(),
      customer.getEmail(),
      customer.getPhoneNumber(),
      customer.getType().name().toLowerCase(),
      customer.getIsBigCustomer(),
      customer.getUsageTarget(),
      customer.getNumberOfHouseholds(),
      customer.getHouseholdRegistrationNumber(),
      customer.getProtectEnvironmentFee(),
      customer.getIsFree(),
      customer.getIsSale(),
      customer.getM3Sale(),
      customer.getFixRate(),
      customer.getInstallationFee(),
      customer.getDeductionPeriod(),
      customer.getMonthlyRent(),
      customer.getWaterMeterType(),
      customer.getCitizenIdentificationNumber(),
      customer.getCitizenIdentificationProvideAt(),
      customer.getPaymentMethod(),
      customer.getBankAccountNumber(),
      customer.getBankAccountProviderLocation(),
      customer.getBankAccountName(),
      customer.getBudgetRelationshipCode(),
      customer.getPassportCode(),
      customer.getConnectionPoint(),
      customer.getIsActive(),
      customer.getCancelReason(),
      customer.getCreatedAt(),
      customer.getUpdatedAt(),
      customer.getFormNumber(),
      customer.getWaterPriceId(),
      waterPrice,
      customer.getWaterMeterId(),
      customer.getBill() != null ? customer.getBill().getExportAddress() : null);
  }

  private WaterPriceInfoResponse resolveWaterPrice(String waterPriceId) {
    if (waterPriceId == null || waterPriceId.isBlank()) {
      return null;
    }

    try {
      WrapperApiResponse response = deviceService.getWaterPriceById(waterPriceId);
      if (response == null || response.data() == null) {
        return null;
      }
      return objectMapper.convertValue(response.data(), WaterPriceInfoResponse.class);
    } catch (Exception ex) {
      log.warn("Cannot resolve water price info for id={}", waterPriceId, ex);
      return null;
    }
  }
}
