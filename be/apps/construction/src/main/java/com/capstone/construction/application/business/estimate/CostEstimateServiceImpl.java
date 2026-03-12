package com.capstone.construction.application.business.estimate;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.construction.application.dto.request.estimate.CostEstimateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
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
public class CostEstimateServiceImpl implements CostEstimateService {
  CostEstimateRepository eRepo;
  InstallationFormRepository ifRepo;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CostEstimateResponse createEstimate(@NonNull CostEstimateRequest request) {
    log.info("Creating new cost estimate for customer: {}", request.customerName());

    var estimate = CostEstimate.create(builder -> builder
      .customerName(request.customerName())
      .address(request.address())
      .note(request.note())
      .contractFee(request.contractFee())
      .surveyFee(request.surveyFee())
      .surveyEffort(request.surveyEffort())
      .installationFee(request.installationFee())
      .laborCoefficient(request.laborCoefficient())
      .generalCostCoefficient(request.generalCostCoefficient())
      .precalculatedTaxCoefficient(request.precalculatedTaxCoefficient())
      .constructionMachineryCoefficient(request.constructionMachineryCoefficient())
      .vatCoefficient(request.vatCoefficient())
      .designCoefficient(request.designCoefficient())
      .designFee(request.designFee())
      .designImageUrl(request.designImageUrl())
      .status(request.status())
      .registrationAt(request.registrationAt())
      .createBy(request.createBy())
      .waterMeterSerial(request.waterMeterSerial())
      .overallWaterMeterId(request.overallWaterMeterId())
      .installationFormId(new InstallationFormId(
        request.formCode(),
        request.formNumber()
      )));

    var saved = eRepo.save(estimate);

    // cap nhat trang thai cua installation form
    var installationForm = ifRepo.findById_FormCodeAndId_FormNumber(request.formCode(), request.formNumber())
      .orElseThrow(() -> new IllegalArgumentException("Invalid form code and form number: " + request.formCode() + request.formNumber()));
    var status = installationForm.getStatus();
    status.setEstimate(ProcessingStatus.PROCESSING);
    ifRepo.save(installationForm);

    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CostEstimateResponse updateEstimate(String id, @NonNull CostEstimateRequest request) {
    log.info("Updating cost estimate with id: {}", id);
    var estimate = eRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Cost estimate not found with id: " + id));

    estimate.setCustomerName(request.customerName());
    estimate.setAddress(request.address());
    estimate.setNote(request.note());
    estimate.setContractFee(request.contractFee());
    estimate.setSurveyFee(request.surveyFee());
    estimate.setSurveyEffort(request.surveyEffort());
    estimate.setInstallationFee(request.installationFee());
    estimate.setLaborCoefficient(request.laborCoefficient());
    estimate.setGeneralCostCoefficient(request.generalCostCoefficient());
    estimate.setPrecalculatedTaxCoefficient(request.precalculatedTaxCoefficient());
    estimate.setConstructionMachineryCoefficient(request.constructionMachineryCoefficient());
    estimate.setVatCoefficient(request.vatCoefficient());
    estimate.setDesignCoefficient(request.designCoefficient());
    estimate.setDesignFee(request.designFee());
    estimate.setDesignImageUrl(request.designImageUrl());
    estimate.setStatus(request.status());
    estimate.setRegistrationAt(request.registrationAt());
    estimate.setCreateBy(request.createBy());
    estimate.setWaterMeterSerial(request.waterMeterSerial());
    estimate.setOverallWaterMeterId(request.overallWaterMeterId());
    estimate.setInstallationFormId(new InstallationFormId(
      request.formCode(),
      request.formNumber()
    ));

    var saved = eRepo.save(estimate);
    return mapToResponse(saved);
  }

  @Override
  public CostEstimateResponse getEstimateById(String id) {
    log.info("Fetching cost estimate with id: {}", id);
    return eRepo.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Cost estimate not found with id: " + id));
  }

  @Override
  public PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable, BaseFilterRequest request) {
    log.info("Fetching all cost estimates with pageable: {}", pageable);
    var startDate = parseFrom(request != null ? request.from() : null);
    var endDate = parseTo(request != null ? request.to() : null);

    var keyword = request == null ? null : request.keyword();

    var page = (startDate != null || endDate != null || (keyword != null && !keyword.isBlank())) ? eRepo.findAll(
      CostEstimateRepository.search(
        keyword,
        startDate,
        endDate
      ), pageable) : eRepo.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private LocalDateTime parseFrom(String from) {
    if (from == null || from.isBlank()) {
      return null;
    }
    return LocalDate.parse(from, DateTimeFormatter.ofPattern("dd-MM-yyyy")).atStartOfDay();
  }

  private LocalDateTime parseTo(String to) {
    if (to == null || to.isBlank()) {
      return null;
    }
    return LocalDate.parse(to, DateTimeFormatter.ofPattern("dd-MM-yyyy")).atTime(LocalTime.MAX);
  }

  private @NonNull CostEstimateResponse mapToResponse(@NonNull CostEstimate estimate) {
    return new CostEstimateResponse(
      estimate.getEstimationId(),
      estimate.getCustomerName(),
      estimate.getAddress(),
      estimate.getNote(),
      estimate.getContractFee(),
      estimate.getSurveyFee(),
      estimate.getSurveyEffort(),
      estimate.getInstallationFee(),
      estimate.getLaborCoefficient(),
      estimate.getGeneralCostCoefficient(),
      estimate.getPrecalculatedTaxCoefficient(),
      estimate.getConstructionMachineryCoefficient(),
      estimate.getVatCoefficient(),
      estimate.getDesignCoefficient(),
      estimate.getDesignFee(),
      estimate.getDesignImageUrl(),
      estimate.getCreatedAt(),
      estimate.getUpdatedAt(),
      estimate.getStatus(),
      estimate.getRegistrationAt(),
      estimate.getCreateBy(),
      estimate.getWaterMeterSerial(),
      estimate.getOverallWaterMeterId(),
      estimate.getInstallationFormId());
  }
}
