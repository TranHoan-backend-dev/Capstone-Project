package com.capstone.construction.application.business.installationform;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.installationform.ApproveRequest;
import com.capstone.construction.application.dto.request.installationform.NewOrderRequest;
import com.capstone.construction.application.dto.response.installationform.InstallationFormListResponse;
import com.capstone.construction.application.dto.response.installationform.NewInstallationFormResponse;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.service.DeviceService;
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
  CostEstimateService costEstimateService;
  CostEstimateRepository costEstimateRepo;
  EmployeeService empSrv;
  DeviceService owmSrv;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public NewInstallationFormResponse createNewInstallationForm(String userId, @NonNull NewOrderRequest request) {
    log.info("Creating new installation form with number: {}", request.formNumber());

    if (!checkMeterExisting(request.overallWaterMeterId())) {
      throw new IllegalArgumentException(Message.PT_58);
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
        .householdRegistrationNumber(request.householdRegistrationNumber())
        .citizenIdentificationProvideLocation(request.citizenIdentificationProvideLocation())
        .network(wsnRepo.findById(request.networkId()).orElseThrow(() -> new IllegalArgumentException("Network not found: " + request.networkId())))
        .overallWaterMeterId(request.overallWaterMeterId())
        .build());

    ifRepo.save(entity);
    return new NewInstallationFormResponse(
        entity.getFormNumber(),
        entity.getCustomerName(),
        entity.getFormCode(),
        entity.getCreatedBy(),
        entity.getCreatedAt());
  }

  @Override
  public Page<InstallationFormListResponse> getInstallationForms(Pageable pageable, @NonNull BaseFilterRequest request) {
    log.info("Fetching paginated installation forms with pageable: {}", pageable);
    var startDate = parseFrom(request.from());
    var endDate = parseTo(request.to());

    var result = (startDate != null || endDate != null || (request.keyword() != null && !request.keyword().isBlank())) ? ifRepo.findAll(
        InstallationFormRepository.search(request.keyword(), startDate, endDate, null, null),
        pageable) : ifRepo.findAllNotRejectedInstallationForms(pageable);

    var content = result.getContent()
        .stream()
        .map(this::mapToResponse)
        .toList();

    return new PageImpl<>(content, pageable, result.getTotalElements());
  }

  @Override
  public Page<InstallationFormListResponse> getConstructionRequestsList(Pageable pageable,
      @NonNull BaseFilterRequest request) {
    log.info("Fetching paginated construction request with pageable: {}", pageable);
    var startDate = parseFrom(request.from());
    var endDate = parseTo(request.to());
    var specification = InstallationFormRepository.search(
        request.keyword(), startDate, endDate,
        ProcessingStatus.APPROVED, ProcessingStatus.PROCESSING);

    var result = ifRepo.findAll(specification, pageable);
    var content = result.getContent()
        .stream()
        .map(this::mapToResponse)
        .toList();

    return new PageImpl<>(content, pageable, result.getTotalElements());
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void approveInstallationForm(String userId, @NonNull ApproveRequest request) {
    log.info("Approving and assigning installation form with number: {}", request.formNumber());
    var order = ifRepo.findById(new InstallationFormId(request.formCode(), request.formNumber()))
      .orElseThrow(() -> new IllegalArgumentException(String.format(SharedMessage.MES_24, request.formNumber(), request.formCode())));

    // nvks chuyen tu don da duyet => don chua duyet
    if (request.status() == null) {
      var requestStatus = order.getStatus();
      requestStatus.setRegistration(ProcessingStatus.PENDING_FOR_APPROVAL);
      requestStatus.setEstimate(ProcessingStatus.PROCESSING);
    } else {
      if (request.status()) {
        // nvks duyet don
        var requestStatus = order.getStatus();
        requestStatus.setRegistration(ProcessingStatus.APPROVED);
        requestStatus.setEstimate(ProcessingStatus.PENDING_FOR_APPROVAL);

        if (costEstimateRepo.existsByInstallationForm(order)) {
          throw new IllegalArgumentException(SharedMessage.MES_25);
        }

        // tao san du toan rong
        costEstimateService.createEstimate(new CreateRequest(
          order.getCustomerName(),
          order.getAddress(),
          LocalDateTime.now(),
          userId,
          order.getFormCode(),
          order.getFormNumber(),
          order.getOverallWaterMeterId()
        ));
      } else {
        // nvks huy don
        var status = order.getStatus();
        status.setRegistration(ProcessingStatus.REJECTED);
      }
    }
    ifRepo.save(order);
  }

  @Override
  public InstallationFormListResponse getByFormCodeAndFormNumber(String formCode, String formNumber) {
    log.info("Fetching installation form with form number: {}", formNumber);
    var result = ifRepo.findById(new InstallationFormId(formCode, formNumber))
        .orElseThrow(() -> new IllegalArgumentException(Message.PT_36));
    return mapToResponse(result);
  }

  @Override
  public Boolean checkAnyFormsBelongedToNetwork(String id) {
    log.info("Checking if installation form with id: {}", id);
    return ifRepo.existsByNetwork_BranchId(id);
  }

  @Override
  public void assignInstallationForm(String id, InstallationFormId installationFormId, @NonNull Boolean status) {
    log.info("Assigning installation form with id: {}", id);
    var form = ifRepo.findById(installationFormId).orElseThrow(() -> new IllegalArgumentException(Message.PT_36));
    if (status) {
      form.setHandoverBy(id);
    } else {
      form.setConstructedBy(id);
    }
    ifRepo.save(form);
  }

  @Override
  public boolean isInstallationFormExisting(String formNumber, String formCode) {
    var status = ifRepo.existsById_FormNumberAndId_FormCode(formNumber, formCode);
    log.info("Installation form with form number: {} and form code {} is exist: {}", formNumber, formCode, status);
    return status;
  }

  private @NonNull InstallationFormListResponse mapToResponse(@NonNull InstallationForm entity) {
    var creatorFullName = empSrv.getEmployeeNameById(entity.getCreatedBy());
    var handOverByFullName = empSrv.getEmployeeNameById(entity.getHandoverBy());
    var constructionEmployeeName = empSrv.getEmployeeNameById(entity.getConstructedBy());
    var unknown = "Trống";

    return new InstallationFormListResponse(
        entity.getFormCode(),
        entity.getFormNumber(),
        entity.getCustomerName(),
        entity.getAddress(),
        entity.getPhoneNumber(),
        entity.getScheduleSurveyAt() == null ? null : entity.getScheduleSurveyAt().toString(),
        entity.getCreatedAt().toString(),
        entity.getHandoverBy(),
        (handOverByFullName != null && handOverByFullName.data() != null) ? handOverByFullName.data().toString()
            : unknown,
        entity.getCreatedBy(),
        (creatorFullName != null && creatorFullName.data() != null) ? creatorFullName.data().toString() : unknown,
        entity.getConstructedBy(),
        (constructionEmployeeName != null && constructionEmployeeName.data() != null)
            ? constructionEmployeeName.data().toString()
            : unknown,
        entity.getStatus(),
        entity.getOverallWaterMeterId()
    );
  }

  private WaterSupplyNetwork getNetwork(String networkId) {
    log.info("Fetching water supply network with ID: {}", networkId);
    return wsnRepo.findById(networkId).orElseThrow(() -> {
      log.error("Water supply network not found: {}", networkId);
      return new IllegalArgumentException(Message.PT_34);
    });
  }

  private boolean checkMeterExisting(String id) {
    log.info("Verifying existence of water meter: {}", id);
    var response = owmSrv.isOverallMeterExisting(id);
    boolean exists = Boolean.parseBoolean(response.data().toString());
    if (!exists) {
      log.warn("Water meter not found: {}", id);
    }
    return exists;
  }

  private LocalDateTime parseFrom(String from) {
    LocalDateTime startDate = null;

    if (from != null) {
      startDate = LocalDate.parse(from, DateTimeFormatter.ISO_LOCAL_DATE).atStartOfDay();
    }
    return startDate;
  }

  private LocalDateTime parseTo(String to) {
    LocalDateTime endDate = null;

    if (to != null) {
      endDate = LocalDate.parse(to, DateTimeFormatter.ISO_LOCAL_DATE).atTime(LocalTime.MAX);
    }
    return endDate;
  }
}
