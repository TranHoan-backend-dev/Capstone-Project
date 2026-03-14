package com.capstone.customer.service.impl;

import com.capstone.customer.dto.request.CustomerRequest;
import com.capstone.customer.dto.response.CustomerResponse;
import com.capstone.customer.model.Customer;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.CustomerService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerServiceImpl implements CustomerService {
  CustomerRepository customerRepository;

  @Override
  @Transactional
  public CustomerResponse createCustomer(@NonNull CustomerRequest request) {
    log.info("Creating customer with email: {}", request.email());
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
      .isFree(request.isFree())
      .isSale(request.isSale())
      .m3Sale(request.m3Sale())
      .fixRate(request.fixRate())
      .installationFee(request.installationFee())
      .deductionPeriod(request.deductionPeriod())
      .monthlyRent(request.monthlyRent())
      .waterMeterType(request.waterMeterType())
      .citizenIdentificationNumber(request.citizenIdentificationNumber())
      .citizenIdentificationProvideAt(request.citizenIdentificationProvideAt())
      .paymentMethod(request.paymentMethod())
      .bankAccountNumber(request.bankAccountNumber())
      .bankAccountProviderLocation(request.bankAccountProviderLocation())
      .bankAccountName(request.bankAccountName())
      .budgetRelationshipCode(request.budgetRelationshipCode())
      .passportCode(request.passportCode())
      .connectionPoint(request.connectionPoint())
      .isActive(request.isActive() != null ? request.isActive() : true)
      .formNumber(request.formNumber())
      .formCode(request.formCode())
      .waterPriceId(request.waterPriceId())
      .waterMeterId(request.waterMeterId()));
    var saved = customerRepository.save(customer);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public CustomerResponse updateCustomer(String id, @NonNull CustomerRequest request) {
    log.info("Updating customer with ID: {}", id);
    var customer = customerRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));

    customer.setName(request.name());
    customer.setEmail(request.email());
    customer.setPhoneNumber(request.phoneNumber());
    customer.setType(request.type());
    customer.setIsBigCustomer(request.isBigCustomer());
    customer.setUsageTarget(request.usageTarget().name());
    customer.setNumberOfHouseholds(request.numberOfHouseholds());
    customer.setHouseholdRegistrationNumber(request.householdRegistrationNumber());
    customer.setProtectEnvironmentFee(request.protectEnvironmentFee());
    customer.setIsFree(request.isFree());
    customer.setIsSale(request.isSale());
    customer.setM3Sale(request.m3Sale());
    customer.setFixRate(request.fixRate());
    customer.setInstallationFee(request.installationFee());
    customer.setDeductionPeriod(request.deductionPeriod());
    customer.setMonthlyRent(request.monthlyRent());
    customer.setWaterMeterType(request.waterMeterType());
    customer.setCitizenIdentificationNumber(request.citizenIdentificationNumber());
    customer.setCitizenIdentificationProvideAt(request.citizenIdentificationProvideAt());
    customer.setPaymentMethod(request.paymentMethod());
    customer.setBankAccountNumber(request.bankAccountNumber());
    customer.setBankAccountProviderLocation(request.bankAccountProviderLocation());
    customer.setBankAccountName(request.bankAccountName());
    customer.setBudgetRelationshipCode(request.budgetRelationshipCode());
    customer.setPassportCode(request.passportCode());
    customer.setConnectionPoint(request.connectionPoint());
    customer.setIsActive(request.isActive());
    customer.setCancelReason(request.cancelReason());
    customer.setFormNumber(request.formNumber());
    customer.setFormCode(request.formCode());
    customer.setWaterPriceId(request.waterPriceId());
    customer.setWaterMeterId(request.waterMeterId());

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
  public Page<CustomerResponse> getAllCustomers(Pageable pageable) {
    log.debug("Fetching all customers with pagination: {}", pageable);
    return customerRepository.findAll(pageable).map(this::mapToResponse);
  }

  @Override
  public boolean areCustomersAppliedThisPrice(String priceId) {
    log.info("Checking if customers are applied this water price: {}", priceId);
    return customerRepository.existsByWaterPriceId(priceId);
  }

  private @NonNull CustomerResponse mapToResponse(@NonNull Customer customer) {
    return new CustomerResponse(
      customer.getCustomerId(),
      customer.getName(),
      customer.getEmail(),
      customer.getPhoneNumber(),
      customer.getType(),
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
      customer.getWaterMeterId());
  }
}
