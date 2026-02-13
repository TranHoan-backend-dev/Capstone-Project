package com.capstone.construction.application.usecase.estimate;

import com.capstone.construction.application.business.estimate.CostEstimateService;
import com.capstone.construction.application.dto.request.estimate.CostEstimateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CostEstimateUseCase {
  CostEstimateService estimateService;

  public CostEstimateResponse createEstimate(CostEstimateRequest request) {
    return estimateService.createEstimate(request);
  }

  public CostEstimateResponse updateEstimate(String id, CostEstimateRequest request) {
    return estimateService.updateEstimate(id, request);
  }

  public void deleteEstimate(String id) {
    estimateService.deleteEstimate(id);
  }

  public CostEstimateResponse getEstimateById(String id) {
    return estimateService.getEstimateById(id);
  }

  public PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable) {
    return estimateService.getAllEstimates(pageable);
  }
}
