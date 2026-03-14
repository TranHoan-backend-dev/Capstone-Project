package com.capstone.device.application.business.unit;

import com.capstone.device.application.dto.request.unit.CreateUnitRequest;
import com.capstone.device.application.dto.request.UpdateUnitRequest;
import com.capstone.device.application.dto.response.UnitResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UnitService {
  Page<UnitResponse> getPaginatedUnits(Pageable pageable, String filterName);

  UnitResponse createUnit(CreateUnitRequest request);

  UnitResponse updateUnit(String id, UpdateUnitRequest request);

  UnitResponse getUnitById(String id);

  void deleteUnit(String id);
}
