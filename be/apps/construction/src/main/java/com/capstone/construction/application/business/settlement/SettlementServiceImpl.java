package com.capstone.construction.application.business.settlement;

import com.capstone.common.enumerate.RoleName;
import com.capstone.common.exception.ForbiddenException;
import com.capstone.common.exception.NotExistingException;
import com.capstone.common.request.BaseMaterial;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.CreateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.UpdateSettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Settlement;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.SettlementRepository;
import com.capstone.construction.infrastructure.service.DeviceService;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.utils.Utility;
import jakarta.persistence.criteria.JoinType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SettlementServiceImpl implements SettlementService {
  SettlementRepository settlementRepository;
  InstallationFormRepository formRepository;
  CostEstimateService costEstimateService;
  EmployeeService empSrv;
  DeviceService deviceSrv;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public SettlementResponse createSettlement(@NonNull CreateSettlementRequest request) {
    log.info("Creating new settlement for address: {}", request.address());
    var form = formRepository.findById(new InstallationFormId(request.formCode(), request.formNumber()))
      .orElseThrow(() -> new NotExistingException(Message.PT_38));

    var settlement = Settlement.builder()
      .settlementId(request.settlementId())
      .jobContent(request.jobContent())
      .customerName(request.customerName())
      .address(request.address())
      .connectionFee(request.connectionFee())
      .note(request.note())
      .installationForm(form)
      .registrationAt(request.registrationAt())
      .build();

    var saved = settlementRepository.save(settlement);
    var ce = costEstimateService.getByFormCode(request.formCode());
    if (ce == null) {
      throw new IllegalArgumentException("Công trình này chưa lập dự toán");
    }

    var response = deviceSrv.updateMaterialsOfSettlement(saved.getSettlementId(), ce.materials());
    if (response.status() != 200) {
      throw new IllegalArgumentException(response.message());
    }
    return mapToResponse(saved, ce.materials());
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public SettlementResponse updateSettlement(String settlementId, @NonNull UpdateSettlementRequest request) {
    log.info("Updating settlement with id: {}", settlementId);
    var settlement = settlementRepository.findById(settlementId)
      .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + settlementId));
    if (request.jobContent() != null)
      settlement.setJobContent(request.jobContent());
    if (request.connectionFee() != null)
      settlement.setConnectionFee(request.connectionFee());
    if (request.note() != null)
      settlement.setNote(request.note());
    settlement.setTotalAmount(request.totalAmount());

    var saved = settlementRepository.save(settlement);

    if (request.materials() != null && !request.materials().isEmpty()) {
      var response = deviceSrv.updateMaterialsOfSettlement(saved.getSettlementId(), request.materials());
      if (response.status() != 200) {
        throw new IllegalArgumentException(response.message());
      }
    }

    // TODO: Cải thiện hiệu năng. Giờ là đang phải làm 2 query, đáng lẽ chỉ cần 1
    return mapToResponse(saved, getMaterials(saved.getSettlementId()));
  }

  @Override
  public SettlementResponse getSettlementById(String settlementId) {
    log.info("Fetching settlement with id: {}", settlementId);
    return settlementRepository.findByIdWithInstallationForm(settlementId)
      .map(s -> mapToResponse(s, getMaterials(s.getSettlementId())))
      .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + settlementId));
  }

  @Override
  public PageResponse<SettlementResponse> getAllSettlements(Pageable pageable) {
    log.info("Fetching all settlements with pageable: {}", pageable);
    var sortedPageable = Utility.sortByAttributeDesc(pageable, "createdAt");

    // Use specification with fetch join
    Specification<Settlement> spec = (root, query, cb) -> {
      root.join("installationForm", JoinType.LEFT);
      return cb.conjunction();
    };
    var page = settlementRepository.findAll(spec, sortedPageable);
    return PageResponse.fromPage(page, s -> mapToResponse(s, getMaterials(s.getSettlementId())));
  }

  @Override
  public PageResponse<SettlementResponse> filterSettlements(SettlementFilterRequest filterRequest, Pageable pageable) {
    log.info("Filtering settlements with filterRequest: {}", filterRequest);
    var sortedPageable = Utility.sortByAttributeDesc(pageable, "createdAt");
    Specification<Settlement> spec = SettlementRepository.filter(filterRequest);
    // Add fetch join to the existing spec

    Specification<Settlement> specWithFetch = spec.and((root, query, cb) -> {
      root.join("installationForm", JoinType.LEFT);
      return cb.conjunction();
    });
    var page = settlementRepository.findAll(specWithFetch, sortedPageable);
    return PageResponse.fromPage(page, s -> mapToResponse(s, getMaterials(s.getSettlementId())));
  }

  @Override
  public boolean signSettlement(String userId, String id, SignificanceRequest request) {
    var settlement = settlementRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + id));
    var significance = settlement.getSignificance();

    var response = empSrv.getRoleOfEmployeeById(userId);
    var role = response.data().toString();
    if (!role.equalsIgnoreCase(RoleName.SURVEY_STAFF.name()) &&
      !role.equalsIgnoreCase(RoleName.COMPANY_LEADERSHIP.name()) &&
      !role.equalsIgnoreCase(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD.name())) {
      throw new ForbiddenException(SharedMessage.MES_23);
    }
    if (request.url() != null && !request.url().isBlank()) {
      if (role.equalsIgnoreCase(RoleName.COMPANY_LEADERSHIP.name()) && request.status() != null && request.status()) {
        significance.setConstructionPresident(request.url());
      }
      if (role.equalsIgnoreCase(RoleName.COMPANY_LEADERSHIP.name())) {
        significance.setPresident(request.url());
      }
      if (role.equalsIgnoreCase(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD.name()) && request.status() == null) {
        significance.setPtHead(request.url());
      }
      if (role.equalsIgnoreCase(RoleName.SURVEY_STAFF.name()) && request.status() == null) {
        significance.setSurveyStaff(request.url());
      }
    }
    settlementRepository.save(settlement);

    return significance.isSettlementFullySigned();
  }

  @Override
  public boolean isExistingSettlement(String id) {
    return settlementRepository.existsById(id);
  }

  @Override
  public boolean checkSettlementExists(String formCode, String formNumber) {
    log.info("Fetching settlement with formCode: {}, formNumber: {}", formCode, formNumber);
    var form = formRepository.findById(new InstallationFormId(formCode, formNumber))
      .orElseThrow(() -> new NotExistingException(Message.PT_38));
    return settlementRepository.existsByInstallationForm(form);
  }

  @Override
  public String getLastId() {
    log.info("Fetching settlement last id");
    return settlementRepository.findTopByOrderByCreatedAtDesc().getSettlementId();
  }

  private @NonNull SettlementResponse mapToResponse(@NonNull Settlement settlement, List<BaseMaterial> materials) {
    var installationForm = settlement.getInstallationForm();
    return new SettlementResponse(
      new SettlementResponse.GeneralInformation(
        settlement.getSettlementId(),
        settlement.getJobContent(),
        settlement.getCustomerName(),
        settlement.getAddress(),
        settlement.getConnectionFee(),
        settlement.getNote(),
        settlement.getCreatedAt(),
        settlement.getUpdatedAt(),
        settlement.getRegistrationAt(),
        installationForm.getFormCode(),
        installationForm.getFormNumber(),
        settlement.getSignificance(),
        installationForm.getStatus()),
      materials);
  }

  private @NonNull List<BaseMaterial> getMaterials(@NonNull String id) {
    var defaultMaterials = deviceSrv.getMaterialsOfSettlement(id);
    var materials = new ArrayList<BaseMaterial>();
    defaultMaterials.forEach(defaultMaterial -> {
      var m = new BaseMaterial(
        defaultMaterial.id(),
        defaultMaterial.jobContent(),
        defaultMaterial.note(),
        defaultMaterial.unitName(),
        defaultMaterial.mass() != null ? defaultMaterial.mass().toString() : "0",
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
