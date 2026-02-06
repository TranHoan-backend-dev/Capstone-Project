package com.capstone.construction.application.business.installationform;

import com.capstone.construction.application.dto.request.NewOrderRequest;
import com.capstone.construction.application.dto.response.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.InstallationFormResponse;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.domain.repository.InstallationFormRepository;
import com.capstone.construction.domain.repository.WaterSupplyNetworkRepository;
import com.capstone.construction.infrastructure.config.Constant;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.service.OverallWaterMeterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InstallationFormServiceImpl implements InstallationFormService {
  InstallationFormRepository ifRepo;
  WaterSupplyNetworkRepository wsnRepo;
  EmployeeService empSrv;
  OverallWaterMeterService owmSrv;

  @Override
  public InstallationFormResponse createNewInstallationForm(@NonNull NewOrderRequest request) {
    log.info("Service is creating new installation form: {}", request.formNumber());

    if (!checkAuthorExisting(request.createdBy())) {
      throw new IllegalArgumentException(Constant.PT_61);
    } else if (!checkMeterExisting(request.overallWaterMeterId())) {
      throw new IllegalArgumentException(Constant.PT_62);
    }

    var entity = InstallationForm.create(builder -> builder
        .formNumber(request.formNumber())
        .customerName(request.customerName())
        .address(request.address())
        .citizenIdentificationNumber(request.citizenIdentificationNumber())
        .citizenIdentificationProvideDate(request.citizenIdentificationProvideDate())
        .citizenIdentificationProvideLocation(request.citizenIdentificationProvideLocation())
        .phoneNumber(request.phoneNumber())
        .taxCode(request.taxCode())
        .bankAccountNumber(request.bankAccountNumber())
        .bankAccountProviderLocation(request.bankAccountProviderLocation())
        .usageTarget(request.usageTarget())
        .receivedFormAt(LocalDateTime.parse(request.receivedFormAt()))
        .scheduleSurveyAt(LocalDateTime.parse(request.scheduleSurveyAt()))
        .numberOfHousehold(request.numberOfHousehold())
        .householdRegistrationNumber(request.householdRegistrationNumber())
        .representative(request.representative())
        .network(getNetwork(request.networkId()))
        .createdBy(request.createdBy())
        .overallWaterMeterId(request.overallWaterMeterId()));

    var saved = ifRepo.save(entity);
    log.info("Installation form with form number: {} is created successfully", request.formNumber());

    return new InstallationFormResponse(
        saved.getFormNumber(),
        saved.getCustomerName(),
        saved.getAddress(),
        saved.getPhoneNumber(),
        saved.getCreatedAt());
  }

  @Override
  public InstallationFormListResponse getInstallationForms(org.springframework.data.domain.Pageable pageable) {
    log.info("Fetching paginated installation forms with pageable: {}", pageable);

    var assignedPage = ifRepo.findByHandoverByIsNotNull(pageable);
    var unassignedPage = ifRepo.findByHandoverByIsNull(pageable);

    return new InstallationFormListResponse(
        assignedPage.map(this::mapToResponse),
        unassignedPage.map(this::mapToResponse));
  }

  private InstallationFormResponse mapToResponse(@NonNull InstallationForm entity) {
    return new InstallationFormResponse(
        entity.getFormNumber(),
        entity.getCustomerName(),
        entity.getAddress(),
        entity.getPhoneNumber(),
        entity.getCreatedAt());
  }

  @Override
  public boolean isInstallationFormExisting(String formNumber) {
    log.info("Checking existence of installation form with form number: {}", formNumber);
    return ifRepo.existsByFormNumber(formNumber);
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
