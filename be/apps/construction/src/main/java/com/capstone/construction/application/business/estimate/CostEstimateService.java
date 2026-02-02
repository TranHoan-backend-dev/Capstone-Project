package com.capstone.construction.application.business.estimate;

import com.capstone.construction.application.dto.request.estimate.CostEstimateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CostEstimateService {
    CostEstimateResponse createEstimate(CostEstimateRequest request);

    CostEstimateResponse updateEstimate(String id, CostEstimateRequest request);

    void deleteEstimate(String id);

    CostEstimateResponse getEstimateById(String id);

    PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable);
}
