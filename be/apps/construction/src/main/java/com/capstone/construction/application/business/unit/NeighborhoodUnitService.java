package com.capstone.construction.application.business.unit;

import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.catalog.NeighborhoodUnitResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface NeighborhoodUnitService {
  void createUnit(NeighborhoodUnitRequest request);

  NeighborhoodUnitResponse updateUnit(String id, NeighborhoodUnitRequest request);

  void deleteUnit(String id);

  NeighborhoodUnitResponse getUnitById(String id);

  PageResponse<NeighborhoodUnitResponse> getAllUnits(Pageable pageable);

  PageResponse<NeighborhoodUnitResponse> getAllUnits(Pageable pageable, String keyword, String communeId);
}
