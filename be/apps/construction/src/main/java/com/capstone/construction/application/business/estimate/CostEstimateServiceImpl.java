package com.capstone.construction.application.business.estimate;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.common.enumerate.RoleName;
import com.capstone.common.request.BaseFilterRequest;
import com.capstone.common.utils.SharedConstant;
import com.capstone.common.utils.SharedMessage;
import com.capstone.common.request.BaseMaterial;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.EstimateFilterRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.estimate.MaterialsOfCostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.domain.model.utils.significance.CostEstimateSignificance;
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
import java.util.Map;
import java.util.HashMap;

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

    var materials = getMaterials(null);
    var response = deviceSrv.updateMaterialsOfCostEstimate(estimate.getEstimationId(), materials);
    if (response.status() != 200) {
      throw new IllegalArgumentException(response.message());
    }

    return mapToResponse(saved, materials);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public CostEstimateResponse updateEstimate(String id, @NonNull UpdateRequest request) {
    log.info("Updating cost estimate with id: {}", id);
    var estimate = getById(id);
    var installationForm = estimate.getInstallationForm();
    if (installationForm.getStatus().getEstimate().name().equals(ProcessingStatus.APPROVED.name())) {
      throw new IllegalArgumentException("Dự toán đã được duyệt, không được phép chỉnh sửa");
    }
    if (installationForm.getStatus().getEstimate().name().equals(ProcessingStatus.REJECTED.name())) {
      var status = installationForm.getStatus();
      status.setEstimate(ProcessingStatus.PROCESSING);
      ifRepo.save(installationForm);
    }

    var generalInformation = request.generalInformation();

    // <editor-fold> desc="setter for general information"
    if (generalInformation.customerName() != null && !generalInformation.customerName().isBlank()) {
      estimate.setCustomerName(generalInformation.customerName());
    }
    if (generalInformation.address() != null && !generalInformation.address().isBlank()) {
      estimate.setAddress(generalInformation.address());
    }
    if (generalInformation.note() != null && !generalInformation.note().isBlank()) {
      estimate.setNote(generalInformation.note());
    }
    if (generalInformation.contractFee() != null) {
      estimate.setContractFee(generalInformation.contractFee());
    }
    if (generalInformation.surveyFee() != null) {
      estimate.setSurveyFee(generalInformation.surveyFee());
    }
    if (generalInformation.surveyEffort() != null) {
      estimate.setSurveyEffort(generalInformation.surveyEffort());
    }
    if (generalInformation.installationFee() != null) {
      estimate.setInstallationFee(generalInformation.installationFee());
    }
    if (generalInformation.laborCoefficient() != null) {
      estimate.setLaborCoefficient(generalInformation.laborCoefficient());
    }
    if (generalInformation.generalCostCoefficient() != null) {
      estimate.setGeneralCostCoefficient(generalInformation.generalCostCoefficient());
    }
    if (generalInformation.precalculatedTaxCoefficient() != null) {
      estimate.setPrecalculatedTaxCoefficient(generalInformation.precalculatedTaxCoefficient());
    }
    if (generalInformation.constructionMachineryCoefficient() != null) {
      estimate.setConstructionMachineryCoefficient(generalInformation.constructionMachineryCoefficient());
    }
    if (generalInformation.vatCoefficient() != null) {
      estimate.setVatCoefficient(generalInformation.vatCoefficient());
    }
    if (generalInformation.designCoefficient() != null) {
      estimate.setDesignCoefficient(generalInformation.designCoefficient());
    }
    if (generalInformation.designFee() != null) {
      estimate.setDesignFee(generalInformation.designFee());
    }
    if (generalInformation.designImage() != null) {
      var url = gcsService.upload(generalInformation.designImage());
      estimate.setDesignImageUrl(url);
    }
    if (generalInformation.waterMeterSerial() != null && !generalInformation.waterMeterSerial().isBlank()) {
      var meterStatus = deviceSrv.isMeterExisting(generalInformation.waterMeterSerial());
      if (!meterStatus) {
        throw new IllegalArgumentException("Đồng hồ nước không tồn tại");
      }
      estimate.setWaterMeterSerial(generalInformation.waterMeterSerial());
    }
    if (generalInformation.overallWaterMeterId() != null && !generalInformation.overallWaterMeterId().isBlank()) {
      var overallMeterStatus = deviceSrv.isOverallMeterExisting(generalInformation.overallWaterMeterId())
        .data().toString();
      if (!Boolean.parseBoolean(overallMeterStatus)) {
        throw new IllegalArgumentException("Đồng hồ tổng không tồn tại");
      }
      estimate.setOverallWaterMeterId(generalInformation.overallWaterMeterId());
    }
    // </editor-fold>

    var saved = eRepo.save(estimate);
    var response = deviceSrv.updateMaterialsOfCostEstimate(estimate.getEstimationId(), request.material());
    if (response.status() != 200) {
      throw new IllegalArgumentException(response.message());
    }
    var materials = deviceSrv.getMaterialsOfCostEstimate(estimate.getEstimationId());

    return mapToResponse(saved, mapMaterials(materials));
  }

  @Override
  public CostEstimateResponse getEstimateById(String id) {
    log.info("Fetching cost estimate with id: {}", id);
    var costEst = getById(id);
    var materials = deviceSrv.getMaterialsOfCostEstimate(id);
    return mapToResponse(costEst, mapMaterials(materials));
  }

  @Override
  public PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable, EstimateFilterRequest request) {
    log.info("Fetching all cost estimates with pageable: {}", pageable);

    // Convert string dates to LocalDateTime
    LocalDateTime startDate = parseFrom(request != null ? request.from() : null);
    LocalDateTime endDate = parseTo(request != null ? request.to() : null);

    var keyword = request == null ? null : request.keyword();

    var page = (startDate != null || endDate != null || (keyword != null && !keyword.isBlank())) ? eRepo.findAll(
      CostEstimateRepository.search(
        keyword,
        startDate,
        endDate),
      pageable) : eRepo.findAll(pageable);
    
    // Create filter map with all non-null parameters
    Map<String, Object> filters = new HashMap<>();

    if (request != null) {
      if (request.keyword() != null && !request.keyword().isBlank()) {
        filters.put("keyword", request.keyword());
      }
      if (request.customerName() != null && !request.customerName().isBlank()) {
        filters.put("customerName", request.customerName());
      }
      if (request.address() != null && !request.address().isBlank()) {
        filters.put("address", request.address());
      }
      if (request.note() != null && !request.note().isBlank()) {
        filters.put("note", request.note());
      }
      if (request.contractFee() != null) {
        filters.put("contractFee", request.contractFee());
      }
      if (request.surveyFee() != null) {
        filters.put("surveyFee", request.surveyFee());
      }
      if (request.surveyEffort() != null) {
        filters.put("surveyEffort", request.surveyEffort());
      }
      if (request.installationFee() != null) {
        filters.put("installationFee", request.installationFee());
      }
      if (request.laborCoefficient() != null) {
        filters.put("laborCoefficient", request.laborCoefficient());
      }
      if (request.generalCostCoefficient() != null) {
        filters.put("generalCostCoefficient", request.generalCostCoefficient());
      }
      if (request.precalculatedTaxCoefficient() != null) {
        filters.put("precalculatedTaxCoefficient", request.precalculatedTaxCoefficient());
      }
      if (request.constructionMachineryCoefficient() != null) {
        filters.put("constructionMachineryCoefficient", request.constructionMachineryCoefficient());
      }
      if (request.vatCoefficient() != null) {
        filters.put("vatCoefficient", request.vatCoefficient());
      }
      if (request.designCoefficient() != null) {
        filters.put("designCoefficient", request.designCoefficient());
      }
      if (request.designFee() != null) {
        filters.put("designFee", request.designFee());
      }
      if (request.registrationAt() != null && !request.registrationAt().isBlank()) {
        filters.put("registrationAt", LocalDate.parse(request.registrationAt(), DateTimeFormatter.ofPattern(SharedConstant.DATE_PATTERN)));
      }
      if (request.createBy() != null && !request.createBy().isBlank()) {
        filters.put("createBy", request.createBy());
      }
      if (request.waterMeterSerial() != null && !request.waterMeterSerial().isBlank()) {
        filters.put("waterMeterSerial", request.waterMeterSerial());
      }
      if (request.overallWaterMeterId() != null && !request.overallWaterMeterId().isBlank()) {
        filters.put("overallWaterMeterId", request.overallWaterMeterId());
      }
      if (request.designImageUrl() != null && !request.designImageUrl().isBlank()) {
        filters.put("designImageUrl", request.designImageUrl());
      }

      // Convert from/to dates to filter if provided
      if (startDate != null) {
        filters.put("from", startDate.toLocalDate());
      }
      if (endDate != null) {
        filters.put("to", endDate.toLocalDate());
      }
    }
    return PageResponse.fromPage(page, estimate -> mapToResponse(estimate, getMaterials(estimate.getEstimationId())));
  }

  @Override
  public void approveEstimate(String id, Boolean request) {
    var est = getById(id);
    var form = est.getInstallationForm();
    var status = form.getStatus();
    status.setEstimate(request ? ProcessingStatus.APPROVED : ProcessingStatus.REJECTED);
    ifRepo.save(form);
  }

  @Override
  public boolean signForCostEstimate(String significance, @NonNull RoleName role, String estimateId) {
    var costEstimate = getById(estimateId);
    var costEstSignificance = costEstimate.getSignificance();

    if (costEstSignificance == null) {
      costEstSignificance = new CostEstimateSignificance();
      costEstimate.setSignificance(costEstSignificance);
    }
    if (costEstSignificance.isCostEstimateFullySigned()) {
      throw new IllegalArgumentException("Du toan da co du chu ky");
    }

    switch (role) {
      case COMPANY_LEADERSHIP -> {
        if (!costEstSignificance.getCompanyLeaderShip().isBlank()) {
          throw new IllegalArgumentException("Lanh dao da ky tai lieu nay");
        }
        costEstSignificance.setCompanyLeaderShip(significance);
      }
      case SURVEY_STAFF -> {
        if (!costEstSignificance.getSurveyStaff().isBlank()) {
          throw new IllegalArgumentException("Nhan vien khao sat da ky tai lieu nay");
        }
        costEstSignificance.setSurveyStaff(significance);
      }
      case PLANNING_TECHNICAL_DEPARTMENT_HEAD -> {
        if (!costEstSignificance.getPlanningTechnicalHead().isBlank()) {
          throw new IllegalArgumentException("Truong phong da ky tai lieu nay");
        }
        costEstSignificance.setPlanningTechnicalHead(significance);
      }
    }
    eRepo.save(costEstimate);

    return costEstSignificance.isCostEstimateFullySigned();
  }

  @Override
  public boolean isExisting(String id) {
    log.info("isExisting with id: {}", id);
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

  private List<BaseMaterial> mapMaterials(List<MaterialsOfCostEstimateResponse> materials) {
    if (materials == null) {
      return new ArrayList<>();
    }
    return materials.stream().map(m -> new BaseMaterial(
      m.id(),
      m.jobContent(),
      m.note(),
      m.unitName(),
      m.mass() != null ? m.mass().toString() : null,
      m.materialCost(),
      m.laborPrice(),
      m.laborPriceAtRuralCommune(),
      m.totalMaterialCost(),
      m.totalLaborCost())).toList();
  }

  private @NonNull CostEstimateResponse mapToResponse(
    @NonNull CostEstimate estimate, List<BaseMaterial> material
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
        estimate.getInstallationForm().getId(),
        estimate.getInstallationForm().getStatus()
      ),
      material);
  }

  private CostEstimate getById(String id) {
    return eRepo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException(String.format(Message.PT_61, id)));
  }

  private @NonNull ArrayList<BaseMaterial> getMaterials(String id) {
    var defaultMaterials = id == null ? deviceSrv.getDefaultMaterials() : deviceSrv.getMaterialsOfCostEstimate(id);
    var materials = new ArrayList<BaseMaterial>();
    defaultMaterials.forEach(defaultMaterial -> {
      var m = new BaseMaterial(
        defaultMaterial.id(),
        defaultMaterial.jobContent(),
        defaultMaterial.note(),
        defaultMaterial.unitName(),
        defaultMaterial.mass().toString(),
        defaultMaterial.materialCost(),
        defaultMaterial.laborPrice(),
        defaultMaterial.laborPriceAtRuralCommune(),
        defaultMaterial.totalMaterialCost(),
        defaultMaterial.totalLaborCost());
      materials.add(m);
    });
    return materials;
  }
}
