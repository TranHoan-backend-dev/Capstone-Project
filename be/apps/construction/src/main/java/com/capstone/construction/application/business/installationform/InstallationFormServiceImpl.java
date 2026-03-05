package com.capstone.construction.application.business.installationform;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.dto.request.installationform.FilterFormRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import com.capstone.construction.infrastructure.config.Constant;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.service.OverallWaterMeterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InstallationFormServiceImpl implements InstallationFormService {
  InstallationFormRepository ifRepo;
  WaterSupplyNetworkRepository wsnRepo;
  EmployeeService empSrv;
  OverallWaterMeterService owmSrv;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public NewInstallationFormResponse createNewInstallationForm(@NonNull NewOrderRequest request) {
    log.info("Creating new installation form with number: {}", request.formNumber());

    if (!checkAuthorExisting(request.createdBy())) {
      throw new IllegalArgumentException(Constant.PT_61);
    }

    if (!checkMeterExisting(request.overallWaterMeterId())) {
      throw new IllegalArgumentException(Constant.SE_06);
    }

    var entity = InstallationForm.create(builder -> builder
      .formCode(request.formCode())
      .formNumber(request.formNumber())
      .customerName(request.customerName())
      .address(request.address())
      .customerType(request.customerType())
      .citizenIdentificationNumber(request.citizenIdentificationNumber())
      .citizenIdentificationProvideDate(request.citizenIdentificationProvideDate())
      .citizenIdentificationProvideLocation(request.citizenIdentificationProvideLocation())
      .phoneNumber(request.phoneNumber())
      .taxCode(request.taxCode())
      .bankAccountNumber(request.bankAccountNumber())
      .bankAccountProviderLocation(request.bankAccountProviderLocation())
      .usageTarget(request.usageTarget())
      .receivedFormAt(LocalDate.parse(request.receivedFormAt()))
      .scheduleSurveyAt(LocalDate.parse(request.scheduleSurveyAt()))
      .numberOfHousehold(request.numberOfHousehold())
      .householdRegistrationNumber(request.householdRegistrationNumber())
      .network(getNetwork(request.networkId()))
      .createdBy(request.createdBy())
      .overallWaterMeterId(request.overallWaterMeterId()));
    if (request.representative() != null) {
      entity.setRepresentative(request.representative());
    }
    if (request.taxCode() != null) {
      entity.setTaxCode(request.taxCode());
    }

    var saved = ifRepo.save(entity);
    log.info("Installation form created successfully: {}", saved.getFormNumber());

    return new NewInstallationFormResponse(
      saved.getFormNumber(),
      saved.getCustomerName(),
      saved.getFormCode(),
      saved.getCreatedBy(),
      saved.getCreatedAt());
  }

  @Override
  public Page<InstallationFormListResponse> getInstallationForms(Pageable pageable, @NonNull FilterFormRequest request) {
    log.info("Fetching paginated installation forms with pageable: {}", pageable);

    LocalDateTime startDate = null;
    LocalDateTime endDate = null;

    if (request.from() != null && request.to() != null) {
      startDate = LocalDate.parse(request.from(), DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay();
      endDate = LocalDate.parse(request.to(), DateTimeFormatter.ISO_LOCAL_DATE).atTime(LocalTime.MAX);
    }

    var result = (startDate != null || (request.keyword() != null && !request.keyword().isBlank())) ? ifRepo.findAll(
      InstallationFormRepository.search(
        request.keyword(),
        startDate,
        endDate),
      pageable) : ifRepo.findAll(pageable);

    var content = result.getContent()
      .stream()
      .map(this::mapToResponse)
      .toList();

    return new PageImpl<>(content, pageable, result.getTotalElements());
  }

  @Override
  public boolean isInstallationFormExisting(String formNumber, String formCode) {
    var status = ifRepo.existsByFormNumberOrFormCode(formNumber, formCode);
    log.info("Installation form with form number: {} and form code {} is exist: {}", formNumber, formCode, status);
    return status;
  }

  private @NonNull InstallationFormListResponse mapToResponse(@NonNull InstallationForm entity) {
    var fullName = empSrv.getEmployeeNameById(entity.getCreatedBy());
    return new InstallationFormListResponse(
      entity.getFormCode(),
      entity.getFormNumber(),
      entity.getCustomerName(),
      entity.getAddress(),
      entity.getPhoneNumber(),
      entity.getScheduleSurveyAt() == null ? null : entity.getScheduleSurveyAt().toString(),
      entity.getCreatedAt().toString(),
      (fullName != null && fullName.data() != null) ? fullName.data().toString() : "Unknown",
      entity.getStatus());
  }

  private WaterSupplyNetwork getNetwork(String networkId) {
    log.info("Fetching water supply network with ID: {}", networkId);
    return wsnRepo.findById(networkId).orElseThrow(() -> {
      log.error("Water supply network not found: {}", networkId);
      return new IllegalArgumentException(Constant.PT_59);
    });
  }

  private boolean checkAuthorExisting(String authorId) {
    log.info("Verifying existence of employee: {}", authorId);
    var response = empSrv.isEmployeeExisting(authorId);
    boolean exists = Boolean.parseBoolean(response.data().toString());
    if (!exists) {
      log.warn("Employee not found: {}", authorId);
    }
    return exists;
  }

  private boolean checkMeterExisting(String id) {
    log.info("Verifying existence of water meter: {}", id);
    var response = owmSrv.isMeterExisting(id);
    boolean exists = Boolean.parseBoolean(response.data().toString());
    if (!exists) {
      log.warn("Water meter not found: {}", id);
    }
    return exists;
  }
}
