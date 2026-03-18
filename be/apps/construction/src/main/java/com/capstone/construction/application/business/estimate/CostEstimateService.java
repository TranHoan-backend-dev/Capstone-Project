package com.capstone.construction.application.business.estimate;

import com.capstone.common.enumerate.ProcessingStatus;
import com.capstone.construction.application.dto.request.estimate.EstimateFilterRequest;
import com.capstone.construction.application.dto.request.estimate.CreateRequest;
import com.capstone.construction.application.dto.request.estimate.UpdateRequest;
import com.capstone.construction.application.dto.response.estimate.CostEstimateResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CostEstimateService {
  CostEstimateResponse createEstimate(CreateRequest request);

  CostEstimateResponse updateEstimate(String id, UpdateRequest request);

  CostEstimateResponse getEstimateById(String id);

  PageResponse<CostEstimateResponse> getAllEstimates(Pageable pageable, EstimateFilterRequest request);

  void approveEstimate(String id, Boolean status);
}
