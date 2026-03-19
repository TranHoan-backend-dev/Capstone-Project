package com.capstone.device.application.business.material.estimate;

import com.capstone.device.application.dto.response.material.MaterialsOfCostEstimateResponse;

import java.util.List;

public interface MaterialsOfCostEstimateService {
  List<MaterialsOfCostEstimateResponse> getByEstimateId(String id);
}
