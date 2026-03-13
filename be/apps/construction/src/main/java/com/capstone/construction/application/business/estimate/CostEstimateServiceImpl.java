package com.capstone.construction.application.business.estimate;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.SharedConstant;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.service.GcsService;
import com.capstone.construction.infrastructure.utils.Message;
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
  GcsService gcsService;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CostEstimateResponse createEstimate(@NonNull CreateRequest request) {
    log.info("Creating new cost estimate for customer: {}", request.customerName());

    var estimate = CostEstimate.create(builder -> builder
      .customerName(request.customerName())
      .address(request.address())
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
    if (request.note() != null && !request.note().isBlank()) {
      estimate.setNote(request.note());
    }

    var saved = eRepo.save(estimate);

    // cap nhat trang thai cua installation form
    var installationForm = ifRepo.findById_FormCodeAndId_FormNumber(request.formCode(), request.formNumber())
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_60, request.formNumber(), request.formCode())));
    var status = installationForm.getStatus();
    status.setEstimate(ProcessingStatus.PROCESSING);
    ifRepo.save(installationForm);

    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CostEstimateResponse updateEstimate(String id, @NonNull UpdateRequest request) {
    log.info("Updating cost estimate with id: {}", id);
    var estimate = eRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_61, id)));

    if (request.customerName() != null && !request.customerName().isBlank()) {
      estimate.setCustomerName(request.customerName());
    }
    if (request.address() != null && !request.address().isBlank()) {
      estimate.setAddress(request.address());
    }
    if (request.note() != null && !request.note().isBlank()) {
      estimate.setNote(request.note());
    }
    if (request.contractFee() != null) {
      estimate.setContractFee(request.contractFee());
    }
    if (request.surveyFee() != null) {
      estimate.setSurveyFee(request.surveyFee());
    }
    if (request.surveyEffort() != null) {
      estimate.setSurveyEffort(request.surveyEffort());
    }
    if (request.installationFee() != null) {
      estimate.setInstallationFee(request.installationFee());
    }
    if (request.laborCoefficient() != null) {
      estimate.setLaborCoefficient(request.laborCoefficient());
    }
    if (request.generalCostCoefficient() != null) {
      estimate.setGeneralCostCoefficient(request.generalCostCoefficient());
    }
    if (request.precalculatedTaxCoefficient() != null) {
      estimate.setPrecalculatedTaxCoefficient(request.precalculatedTaxCoefficient());
    }
    if (request.constructionMachineryCoefficient() != null) {
      estimate.setConstructionMachineryCoefficient(request.constructionMachineryCoefficient());
    }
    if (request.vatCoefficient() != null) {
      estimate.setVatCoefficient(request.vatCoefficient());
    }
    if (request.designCoefficient() != null) {
      estimate.setDesignCoefficient(request.designCoefficient());
    }
    if (request.designFee() != null) {
      estimate.setDesignFee(request.designFee());
    }
    if (request.designImage() != null) {
      var url = gcsService.upload(request.designImage());
      estimate.setDesignImageUrl(url);
    }
    if (request.status() != null) {
      estimate.setStatus(request.status());
    }
    if (request.waterMeterSerial() != null && !request.waterMeterSerial().isBlank()) {
      estimate.setWaterMeterSerial(request.waterMeterSerial());
    }
    if (request.overallWaterMeterId() != null && !request.overallWaterMeterId().isBlank()) {
      estimate.setOverallWaterMeterId(request.overallWaterMeterId());
    }

    var saved = eRepo.save(estimate);
    return mapToResponse(saved);
  }

  @Override
  public CostEstimateResponse getEstimateById(String id) {
    log.info("Fetching cost estimate with id: {}", id);
    return eRepo.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_61, id)));
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
    return LocalDate.parse(from, DateTimeFormatter.ofPattern(SharedConstant.DATE_PATTERN)).atStartOfDay();
  }

  private LocalDateTime parseTo(String to) {
    if (to == null || to.isBlank()) {
      return null;
    }
    return LocalDate.parse(to, DateTimeFormatter.ofPattern(SharedConstant.DATE_PATTERN)).atTime(LocalTime.MAX);
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
