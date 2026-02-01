package com.capstone.construction.application.business.estimate;

import com.capstone.construction.application.dto.request.estimate.CostEstimateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.CostEstimate;
import com.capstone.construction.domain.repository.CostEstimateRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CostEstimateServiceImpl implements CostEstimateService {
    CostEstimateRepository estimateRepository;

    @Override
    @Transactional
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
                .installationFormId(request.installationFormId()));

        var saved = estimateRepository.save(estimate);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CostEstimateResponse updateEstimate(String id, @NonNull CostEstimateRequest request) {
        log.info("Updating cost estimate with id: {}", id);
        var estimate = estimateRepository.findById(id)
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
        estimate.setInstallationFormId(request.installationFormId());

        var saved = estimateRepository.save(estimate);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteEstimate(String id) {
        log.info("Deleting cost estimate with id: {}", id);
        if (!estimateRepository.existsById(id)) {
            throw new IllegalArgumentException("Cost estimate not found with id: " + id);
        }
        estimateRepository.deleteById(id);
    }

    @Override
    public CostEstimateResponse getEstimateById(String id) {
        log.info("Fetching cost estimate with id: {}", id);
        return estimateRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Cost estimate not found with id: " + id));
    }

    @Override
    public PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable) {
        log.info("Fetching all cost estimates with pageable: {}", pageable);
        var page = estimateRepository.findAll(pageable);
        return PageResponse.fromPage(page, this::mapToResponse);
    }

    private CostEstimateResponse mapToResponse(CostEstimate estimate) {
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
