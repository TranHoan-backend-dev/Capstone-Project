package com.capstone.device.application.business.material.estimate;

import com.capstone.common.request.BaseMaterial;
import com.capstone.device.application.dto.response.material.MaterialsListResponse;

import java.util.List;

public interface MaterialsOfCostEstimateService {
  List<MaterialsListResponse> getByEstimateId(String id);

  void update(List<BaseMaterial> material, String estimateId);

  List<MaterialsListResponse> getDefaultMaterial();
}
