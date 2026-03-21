package com.capstone.construction.application.business.settlement;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.exception.NotExistingException;
import com.capstone.construction.application.dto.request.settlement.SettlementFilterRequest;
import com.capstone.construction.application.dto.request.settlement.SettlementRequest;
import com.capstone.construction.application.dto.request.settlement.SignificanceRequest;
import com.capstone.construction.application.dto.response.settlement.SettlementResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Settlement;
import com.capstone.construction.domain.model.SettlementStatus;
import com.capstone.construction.domain.model.InstallationForm;
import com.capstone.construction.domain.model.utils.InstallationFormId;
import com.capstone.construction.infrastructure.persistence.InstallationFormRepository;
import com.capstone.construction.infrastructure.persistence.SettlementRepository;
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

        // Set status if provided, default to PROCESSING
        if (request.status() != null && !request.status().isEmpty()) {
            List<SettlementStatus> statuses = request.status().stream()
                    .map(status -> SettlementStatus.valueOf(status.toUpperCase()))
                    .collect(Collectors.toList());
            settlement.setStatus(statuses.get(0)); // Use first status
        } else {
            settlement.setStatus(SettlementStatus.PROCESSING);
        }

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

        // Update status if provided
        if (request.status() != null && !request.status().isEmpty()) {
            List<SettlementStatus> statuses = request.status().stream()
                    .map(status -> SettlementStatus.valueOf(status.toUpperCase()))
                    .collect(Collectors.toList());
            settlement.setStatus(statuses.get(0)); // Use first status
        }

        var saved = settlementRepository.save(settlement);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SettlementResponse updateSettlementStatus(String id, String status) {
        log.info("Updating settlement status with id: {} to: {}", id, status);
        var settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + id));

        try {
            SettlementStatus newStatus = SettlementStatus.valueOf(status.toUpperCase());
            settlement.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status + ". Valid values: " +
                    java.util.Arrays.toString(SettlementStatus.values()));
        }

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
    public boolean signSettlement(@NonNull SignificanceRequest request, String id) {
        var settlement = settlementRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Settlement not found with id: " + id));
        var significance = settlement.getSignificance();

        if (request.constructionPresident() != null && !request.constructionPresident().isBlank()) {
            significance.setConstructionPresident(request.constructionPresident());
        }
        if (request.president() != null && !request.president().isBlank()) {
            significance.setPresident(request.president());
        }
        if (request.ptHead() != null && !request.ptHead().isBlank()) {
            significance.setPtHead(request.ptHead());
        }
        if (request.surveyStaff() != null && !request.surveyStaff().isBlank()) {
            significance.setSurveyStaff(request.surveyStaff());
        }
        return significance.isSettlementFullySigned();
    }

    @Override
    public boolean isExistingSettlement(String id) {
        return settlementRepository.existsById(id);
    }

    private @NonNull SettlementResponse mapToResponse(@NonNull Settlement settlement) {
        InstallationForm form = settlement.getInstallationForm();
        return new SettlementResponse(
                settlement.getSettlementId(),
                settlement.getJobContent(),
                settlement.getAddress(),
                settlement.getConnectionFee(),
                settlement.getNote(),
                settlement.getCreatedAt(),
                settlement.getUpdatedAt(),
                settlement.getRegistrationAt(),
                form != null ? form.getFormCode() : null,
                form != null ? form.getFormNumber() : null,
                settlement.getSignificance(),
                List.of(settlement.getStatus())
        );
    }
}
