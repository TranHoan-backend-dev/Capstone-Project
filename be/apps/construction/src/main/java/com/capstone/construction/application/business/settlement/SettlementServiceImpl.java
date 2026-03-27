package com.capstone.construction.application.business.settlement;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;
import com.capstone.common.exception.ForbiddenException;
import com.capstone.common.exception.NotExistingException;
import com.capstone.common.utils.SharedMessage;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Settlement;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.SettlementRepository;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SettlementServiceImpl implements SettlementService {
  SettlementRepository settlementRepository;
  InstallationFormRepository formRepository;
  EmployeeService empSrv;
  @NonFinal
  Logger log;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SettlementResponse createSettlement(@NonNull SettlementRequest request) {
        log.info("Creating new settlement for address: {}", request.address());
        var form = formRepository.findById(new InstallationFormId(request.formCode(), request.formNumber()))
                .orElseThrow(() -> new NotExistingException(Message.PT_38));

        var settlement = Settlement.create(builder -> builder
                .jobContent(request.jobContent())
                .address(request.address())
                .connectionFee(request.connectionFee())
                .note(request.note())
                .installationForm(form)
                .registrationAt(request.registrationAt()));

        var saved = settlementRepository.save(settlement);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SettlementResponse updateSettlement(String id, @NonNull SettlementRequest request) {
        log.info("Updating settlement with id: {}", id);
        var settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + id));
        settlement.setJobContent(request.jobContent());
        settlement.setAddress(request.address());
        settlement.setConnectionFee(request.connectionFee());
        settlement.setNote(request.note());
        settlement.setRegistrationAt(request.registrationAt());

        var saved = settlementRepository.save(settlement);
        return mapToResponse(saved);
    }

    @Override
    public SettlementResponse getSettlementById(String id) {
        log.info("Fetching settlement with id: {}", id);
        return settlementRepository.findByIdWithInstallationForm(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + id));
    }

    @Override
    public PageResponse<SettlementResponse> getAllSettlements(Pageable pageable) {
        log.info("Fetching all settlements with pageable: {}", pageable);
        // Use specification with fetch join
        Specification<Settlement> spec = (root, query, cb) -> {
            root.join("installationForm", jakarta.persistence.criteria.JoinType.LEFT);
            return cb.conjunction();
        };
        var page = settlementRepository.findAll(spec, pageable);
        return PageResponse.fromPage(page, this::mapToResponse);
    }

    @Override
    public PageResponse<SettlementResponse> filterSettlements(SettlementFilterRequest filterRequest, Pageable pageable) {
        log.info("Filtering settlements with filterRequest: {}", filterRequest);
        Specification<Settlement> spec = SettlementRepository.filter(filterRequest);
        // Add fetch join to the existing spec
        Specification<Settlement> specWithFetch = spec.and((root, query, cb) -> {
            root.join("installationForm", jakarta.persistence.criteria.JoinType.LEFT);
            return cb.conjunction();
        });
        var page = settlementRepository.findAll(specWithFetch, pageable);
        return PageResponse.fromPage(page, this::mapToResponse);
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
      if (role.equalsIgnoreCase(RoleName.COMPANY_LEADERSHIP.name())) {
        significance.setConstructionPresident(request.url());
      }
      if (role.equalsIgnoreCase(RoleName.COMPANY_LEADERSHIP.name())) {
        significance.setPresident(request.url());
      }
      if (role.equalsIgnoreCase(RoleName.PLANNING_TECHNICAL_DEPARTMENT_HEAD.name())) {
        significance.setPtHead(request.url());
      }
      if (role.equalsIgnoreCase(RoleName.SURVEY_STAFF.name())) {
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

  private @NonNull SettlementResponse mapToResponse(@NonNull Settlement settlement) {
    var installationForm = settlement.getInstallationForm();
    return new SettlementResponse(
      settlement.getSettlementId(),
      settlement.getJobContent(),
      settlement.getAddress(),
      settlement.getConnectionFee(),
      settlement.getNote(),
      settlement.getCreatedAt(),
      settlement.getUpdatedAt(),
      settlement.getRegistrationAt(),
      installationForm.getFormCode(),
      installationForm.getFormNumber(),
      settlement.getSignificance(),
      installationForm.getStatus()
    );
  }
}
