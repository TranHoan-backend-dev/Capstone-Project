package com.capstone.construction.application.business.estimate;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.enumerate.RoleName;
import com.capstone.common.utils.BaseFilterRequest;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.material.MaterialsOfCostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.CostEstimateRepository;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.service.GcsService;
import com.capstone.construction.infrastructure.service.DeviceService;
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
import java.util.ArrayList;
import java.util.List;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CostEstimateServiceImpl implements CostEstimateService {
  CostEstimateRepository eRepo;
  InstallationFormRepository ifRepo;
  GcsService gcsService;
  DeviceService deviceSrv;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CostEstimateResponse createEstimate(@NonNull CreateRequest request) {
    log.info("Creating new cost estimate for customer: {}", request.customerName());
    var installationForm = ifRepo.findById(new InstallationFormId(request.formCode(), request.formNumber()))
      .orElseThrow(() -> new IllegalArgumentException(
        String.format(SharedMessage.MES_24, request.formCode(), request.formNumber())));

    var est = eRepo.existsByInstallationForm(installationForm);
    if (est) {
      throw new IllegalArgumentException(Message.PT_29);
    }

    var estimate = CostEstimate.create(builder -> builder
      .customerName(request.customerName())
      .address(request.address())
      .registrationAt(LocalDate.from(request.registrationAt()))
      .createBy(request.createBy())
      .installationForm(installationForm)
      .overallWaterMeterId(request.overallWaterMeterId()));

    var saved = eRepo.save(estimate);

    // cap nhat trang thai cua installation form
    var status = installationForm.getStatus();
    status.setEstimate(ProcessingStatus.PROCESSING);
    ifRepo.save(installationForm);

    var materials = getMaterials();

    return mapToResponse(saved, materials);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CostEstimateResponse updateEstimate(String id, @NonNull UpdateRequest request) {
    log.info("Updating cost estimate with id: {}", id);
    var estimate = eRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_61, id)));

    // <editor-fold> desc="setter"
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
    if (request.waterMeterSerial() != null && !request.waterMeterSerial().isBlank()) {
      var meterStatus = deviceSrv.isMeterExisting(request.waterMeterSerial())
        .data().toString();
      if (!Boolean.parseBoolean(meterStatus)) {
        throw new IllegalArgumentException("Đồng hồ nước không tồn tại");
      }
      estimate.setWaterMeterSerial(request.waterMeterSerial());
    }
    if (request.overallWaterMeterId() != null && !request.overallWaterMeterId().isBlank()) {
      var overallMeterStatus = deviceSrv.isOverallMeterExisting(request.overallWaterMeterId())
        .data().toString();
      if (!Boolean.parseBoolean(overallMeterStatus)) {
        throw new IllegalArgumentException("Đồng hồ tổng không tồn tại");
      }
      estimate.setOverallWaterMeterId(request.overallWaterMeterId());
    }
    // </editor-fold>

    var saved = eRepo.save(estimate);
    var materials = deviceSrv.getMaterialsOfCostEstimate(estimate.getEstimationId());

    return mapToResponse(saved, mapMaterials(materials));
  }

  @Override
  public CostEstimateResponse getEstimateById(String id) {
    log.info("Fetching cost estimate with id: {}", id);
    var costEst = eRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_61, id)));
    var materials = deviceSrv.getMaterialsOfCostEstimate(id);
    return mapToResponse(costEst, mapMaterials(materials));
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
        endDate),
      pageable) : eRepo.findAll(pageable);
    return PageResponse.fromPage(page, estimate -> mapToResponse(estimate, new ArrayList<>()));
  }

  @Override
  public void approveEstimate(String id, Boolean request) {
    var est = eRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_61, id)));
    var form = est.getInstallationForm();
    var status = form.getStatus();
    status.setEstimate(request ? ProcessingStatus.APPROVED : ProcessingStatus.REJECTED);
    ifRepo.save(form);
  }

  @Override
  public boolean signForCostEstimate(String significance, @NonNull RoleName role, String estimateId) {
    var costEstimate = eRepo.findById(estimateId)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_61, estimateId)));
    var costEstSignificance = costEstimate.getSignificance();
    switch (role) {
      case COMPANY_LEADERSHIP -> costEstSignificance.setCompanyLeaderShip(significance);
      case SURVEY_STAFF -> costEstSignificance.setSurveyStaff(significance);
      case PLANNING_TECHNICAL_DEPARTMENT_HEAD -> costEstSignificance.setPlanningTechnicalHead(significance);
    }
    eRepo.save(costEstimate);

    return costEstSignificance.isCostEstimateFullySigned();
  }

  @Override
  public boolean isExisting(String id) {
    return eRepo.existsById(id);
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

  private List<CostEstimateResponse.Material> mapMaterials(List<MaterialsOfCostEstimateResponse> materials) {
    if (materials == null) {
      return new ArrayList<>();
    }
    return materials.stream().map(m -> new CostEstimateResponse.Material(
      m.materialId(),
      m.jobContent(),
      m.note(),
      m.unitName(),
      m.reductionCoefficient() != null ? m.reductionCoefficient().toString() : null,
      m.mass() != null ? m.mass().toString() : null,
      m.materialCost(),
      m.laborCost(),
      m.laborPriceAtRuralCommune(),
      m.usedLaborCost(),
      m.totalMaterialCost(),
      m.totalLaborCost())).toList();
  }

  private @NonNull CostEstimateResponse mapToResponse(
    @NonNull CostEstimate estimate, List<CostEstimateResponse.Material> material
  ) {
    return new CostEstimateResponse(
      new CostEstimateResponse.GeneralInformation(
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
        estimate.getRegistrationAt(),
        estimate.getCreateBy(),
        estimate.getWaterMeterSerial(),
        estimate.getOverallWaterMeterId(),
        estimate.getInstallationForm().getId()),
      material);
  }

  private @NonNull ArrayList<CostEstimateResponse.Material> getMaterials() {
    var defaultMaterials = deviceSrv.getDefaultMaterials();
    var materials = new ArrayList<CostEstimateResponse.Material>();
    defaultMaterials.forEach(defaultMaterial -> {
      var m = new CostEstimateResponse.Material(
        defaultMaterial.id(),
        defaultMaterial.jobContent(),
        null,
        defaultMaterial.unitName(),
        null,
        null,
        defaultMaterial.price().toString(),
        defaultMaterial.laborPrice().toString(),
        defaultMaterial.laborPriceAtRuralCommune().toString(),
        null,
        null,
        null);
      materials.add(m);
    });
    return materials;
  }
}
