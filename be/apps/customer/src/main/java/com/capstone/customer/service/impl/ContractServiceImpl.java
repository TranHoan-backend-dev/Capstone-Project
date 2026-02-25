package com.capstone.customer.service.impl;

import com.capstone.customer.dto.request.ContractRequest;
import com.capstone.customer.dto.response.ContractResponse;
import com.capstone.customer.model.WaterUsageContract;
import com.capstone.customer.repository.ContractRepository;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.ContractService;
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
public class ContractServiceImpl implements ContractService {
  ContractRepository contractRepository;
  CustomerRepository customerRepository;

  @Override
  @Transactional
  public ContractResponse createContract(@NonNull ContractRequest request) {
    log.info("Creating contract with ID: {}", request.contractId());
    var customer = customerRepository.findById(request.customerId())
      .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + request.customerId()));

    var contract = WaterUsageContract.create(builder -> builder
      .id(request.contractId())
      .customer(customer)
      .installationFormId(request.installationFormId())
      .representative(request.representatives()));

    var saved = contractRepository.save(contract);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public ContractResponse updateContract(String id, @NonNull ContractRequest request) {
    log.info("Updating contract with ID: {}", id);
    var contract = contractRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Contract not found with ID: " + id));

    if (!contract.getCustomer().getCustomerId().equals(request.customerId())) {
      var newCustomer = customerRepository.findById(request.customerId())
        .orElseThrow(
          () -> new IllegalArgumentException("Customer not found with ID: " + request.customerId()));
      contract.setCustomer(newCustomer);
    }

    contract.setContractId(request.contractId());
    contract.setInstallationFormId(request.installationFormId());
    contract.setRepresentative(request.representatives());

    var updated = contractRepository.save(contract);
    return mapToResponse(updated);
  }

  @Override
  @Transactional
  public void deleteContract(String id) {
    log.info("Deleting contract with ID: {}", id);
    if (!contractRepository.existsById(id)) {
      throw new IllegalArgumentException("Contract not found with ID: " + id);
    }
    contractRepository.deleteById(id);
  }

  @Override
  public ContractResponse getContractById(String id) {
    log.info("Fetching contract with ID: {}", id);
    return contractRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Contract not found with ID: " + id));
  }

  @Override
  public Page<ContractResponse> getAllContracts(Pageable pageable) {
    log.debug("Fetching all contracts with pagination: {}", pageable);
    return contractRepository.findAll(pageable).map(this::mapToResponse);
  }

  private ContractResponse mapToResponse(@NonNull WaterUsageContract contract) {
    return new ContractResponse(
      contract.getContractId(),
      contract.getCreatedAt(),
      contract.getUpdatedAt(),
      contract.getCustomer().getName(),
      contract.getCustomer().getCustomerId(),
      contract.getInstallationFormId(),
      contract.getRepresentative());
  }
}
