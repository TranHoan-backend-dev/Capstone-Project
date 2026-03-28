package com.capstone.customer.service.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.SharedConstant;
import com.capstone.customer.dto.request.ContractFilterRequest;
import com.capstone.customer.dto.request.contract.CreateRequest;
import com.capstone.customer.dto.response.ContractResponse;
import com.capstone.customer.model.WaterUsageContract;
import com.capstone.customer.repository.ContractRepository;
import com.capstone.customer.repository.CustomerRepository;
import com.capstone.customer.service.boundary.ConstructionService;
import com.capstone.customer.service.boundary.ContractService;
import com.capstone.customer.utils.Message;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ContractServiceImpl implements ContractService {
  ContractRepository contractRepository;
  CustomerRepository customerRepository;
  ConstructionService cSrv;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public ContractResponse createContract(@NonNull CreateRequest request) {
    log.info("Creating contract with ID: {}", request.contractId());
    var status = cSrv.checkExistence(request.formCode(), request.formNumber());
    if (!status) {
      throw new IllegalArgumentException(Message.ENT_16);
    }

    var contract = WaterUsageContract.builder()
      .contractId(request.contractId())
      .formNumber(request.formNumber())
      .formCode(request.formCode())
      .build();
    if (request.representatives() != null && !request.representatives().isEmpty()) {
      contract.setRepresentative(request.representatives());
    }
    if (request.appendix() != null && !request.appendix().isEmpty()) {
      contract.setAppendix(request.appendix());
    }

    var saved = contractRepository.save(contract);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteContract(String id) {
    log.info("Deleting contract with ID: {}", id);
    if (!contractRepository.existsById(id)) {
      throw new IllegalArgumentException(String.format(Message.ENT_22, id));
    }
    contractRepository.deleteById(id);
  }

  @Override
  public ContractResponse getContractById(String id) {
    log.info("Fetching contract with ID: {}", id);
    return contractRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.ENT_22, id)));
  }

  @Override
  public Page<ContractResponse> getAllContracts(Pageable pageable, ContractFilterRequest request) {
    log.info("Fetching all contracts with pagination: {}", pageable);

    var result = contractRepository.findAll(
      ContractRepository.filter(request),
      pageable
    );
    log.info(result.toString());

    return result.map(this::mapToResponse);
  }

  @Override
  public List<String> findContractIdsByFormCodeAndFormNumber(String formCode, String formNumber) {
    log.info("Fetching contract IDs by formCode: {} and formNumber: {}", formCode, formNumber);
    return contractRepository.findContractIdsByFormCodeAndFormNumber(formCode, formNumber);
  }

  private LocalDateTime parseFrom(String from) {
    if (from == null || from.isBlank()) {
      return null;
    }
    return LocalDate.parse(from, DateTimeFormatter.ofPattern(SharedConstant.DATE_PATTERN)).atStartOfDay();
  }

  private LocalDateTime parseTo(String to) {
    if (to == null || to.isBlank()) {
      return null;
    }
    return LocalDate.parse(to, DateTimeFormatter.ofPattern(SharedConstant.DATE_PATTERN)).atTime(LocalTime.MAX);
  }

  private @NonNull ContractResponse mapToResponse(@NonNull WaterUsageContract contract) {
    return new ContractResponse(
      contract.getContractId(),
      contract.getCreatedAt(),
      contract.getUpdatedAt(),
      contract.getFormCode(),
      contract.getRepresentative());
  }
}
