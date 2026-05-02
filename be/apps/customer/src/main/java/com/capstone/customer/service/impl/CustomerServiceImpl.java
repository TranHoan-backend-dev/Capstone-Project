package com.capstone.customer.service.impl;

import com.capstone.common.exception.NotExistingException;
import com.capstone.common.utils.SharedMessage;
import com.capstone.customer.dto.request.customer.CreateRequest;
import com.capstone.customer.dto.request.customer.UpdateRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.dto.response.WaterMeterInfoResponse;
import com.capstone.customer.dto.response.WaterPriceInfoResponse;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.ContractRepository;
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

import java.time.LocalDate;
import java.util.Map;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerServiceImpl implements CustomerService {
  CustomerRepository customerRepository;
  ContractRepository contractRepository;
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
    if (!constructionService.isExistingRoadmap(request.roadmapId())) {
      throw new IllegalArgumentException(Message.ENT_27);
    }

    var customer = Customer.builder()
      .name(request.name())
      .email(request.email())
      .phoneNumber(request.phoneNumber())
      .type(request.type())
      .address(request.address())
      .isBigCustomer(request.isBigCustomer())
      .usageTarget(request.usageTarget())
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
      .isActive(request.isActive() != null ? request.isActive() : true)
      .roadmapId(request.roadmapId())
      .contract(contractRepository.findById(request.contractId()).orElseThrow(() -> new NotExistingException("Hop dong khong ton tai")))
      .build();

    setProperties2(
      customer, request.formCode(), request.formNumber(),
      request.waterPriceId(), request.waterMeterId(), request.waterMeterType());
    setProperties(
      customer, request.isFree(), request.isSale(), request.m3Sale(),
      request.fixRate(), request.installationFee(), request.deductionPeriod(),
      request.monthlyRent());
    setProperties1(
      customer, request.budgetRelationshipCode(), request.passportCode(),
      request.connectionPoint());

    var saved = customerRepository.save(customer);
    log.info("New customer: {}", saved);
    return mapToResponse(saved);
  }

  private void setProperties2(
    Customer customer, String formCode, String formNumber,
    String waterPriceId, String waterMeterId, String waterMeterType) {
    if (formCode != null && !formCode.isBlank() &&
      formNumber != null && !formNumber.isBlank()) {
      var status = constructionService.checkExistence(formCode, formNumber);
      if (!status) {
        throw new NotExistingException(String.format(SharedMessage.MES_24, formNumber, formCode));
      }
      customer.setFormNumber(formNumber);
      customer.setFormCode(formCode);
    }
    if (waterPriceId != null && !waterPriceId.isBlank()) {
      if (!deviceService.checkExistenceOfWaterPrice(waterPriceId)) {
        throw new IllegalArgumentException(Message.ENT_28);
      }
      customer.setWaterPriceId(waterPriceId);
    }
    if (waterMeterId != null && !waterMeterId.isBlank() && !waterMeterId.equals(customer.getWaterMeterId())) {
      if (deviceService.checkExistenceOfWaterMeter(waterMeterId)) {
        throw new IllegalArgumentException("Đồng hồ nước này đã được sử dụng");
      }

      deviceService.createWaterMeter(Map.of(
        "meterId", waterMeterId,
        "installationDate", LocalDate.now().toString(),
        "size", 15,
        "typeId", waterMeterType != null ? waterMeterType : customer.getWaterMeterType()
      ));

      customer.setWaterMeterId(waterMeterId);
    }
  }

  private void setProperties(
    Customer customer, Boolean free, Boolean sale, String m3Sale,
    String fixRate, Integer installationFee, String deductionPeriod, Integer monthlyRent
  ) {
    if (free != null) {
      customer.setIsFree(free);
    }
    if (sale != null) {
      customer.setIsSale(sale);
    }
    if (m3Sale != null) {
      customer.setM3Sale(m3Sale);
    }
    if (fixRate != null) {
      customer.setFixRate(fixRate);
    }
    if (installationFee != null) {
      customer.setInstallationFee(installationFee);
    }
    if (deductionPeriod != null && !deductionPeriod.isBlank()) {
      customer.setDeductionPeriod(deductionPeriod);
    }
    if (monthlyRent != null) {
      customer.setMonthlyRent(monthlyRent);
    }
  }

  private void setProperties1(
    Customer customer, String budgetRelationshipCode,
    String passportCode, String connectionPoint
  ) {
    if (budgetRelationshipCode != null && !budgetRelationshipCode.isBlank()) {
      customer.setBudgetRelationshipCode(budgetRelationshipCode);
    }
    if (passportCode != null && !passportCode.isBlank()) {
      customer.setPassportCode(passportCode);
    }
    if (connectionPoint != null && !connectionPoint.isBlank()) {
      customer.setConnectionPoint(connectionPoint);
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

    if (request.contractId() != null && !request.contractId().isBlank()) {
      var contract = contractRepository.findById(request.contractId())
        .orElseThrow(() -> new IllegalArgumentException(String.format(Message.ENT_22, request.contractId())));
      customer.setContract(contract);
    }
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

    setProperties2(
      customer, request.formCode(), request.formNumber(),
      request.waterPriceId(), request.waterMeterId(), request.waterMeterType());
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
    log.info("Get customer id by meterId: {}", meterId);
    return customerRepository.findTopByWaterMeterId(meterId)
      .orElseThrow(() -> new NotExistingException("Không tìm thấy khách hàng"))
      .getCustomerId();
  }

  @Override
  public int countCustomersOfRoadmap(String roadmapId) {
    log.info("Counting customers of roadmap: {}", roadmapId);
    return customerRepository.countByRoadmapId(roadmapId);
  }

  @Override
  public boolean isFree(String customerId) {
    log.info("Checking if customers are free: {}", customerId);
    return customerRepository.findById(customerId)
      .orElseThrow(() -> new NotExistingException("Khach hang khong ton tai"))
      .getIsFree();
  }

  private @NonNull CustomerResponse mapToResponse(@NonNull Customer customer) {
    var waterPrice = resolveWaterPrice(customer.getWaterPriceId());
    var waterMeter = resolveWaterMeter(customer.getWaterMeterId());

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
      customer.getFormCode(),
      customer.getWaterPriceId(),
      waterPrice,
      customer.getWaterMeterId(),
      waterMeter,
      customer.getAddress(),
      customer.getRoadmapId()
    );
  }

  private WaterMeterInfoResponse resolveWaterMeter(String waterMeterId) {
    if (waterMeterId == null || waterMeterId.isBlank()) {
      return null;
    }

    try {
      var response = deviceService.getWaterMeterById(waterMeterId);
      if (response == null || response.data() == null) {
        return null;
      }
      return objectMapper.convertValue(response.data(), WaterMeterInfoResponse.class);
    } catch (Exception ex) {
      log.warn("Cannot resolve water meter info for id={}", waterMeterId, ex);
      return null;
    }
  }

  private WaterPriceInfoResponse resolveWaterPrice(String waterPriceId) {
    if (waterPriceId == null || waterPriceId.isBlank()) {
      return null;
    }

    try {
      var response = deviceService.getWaterPriceById(waterPriceId);
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
