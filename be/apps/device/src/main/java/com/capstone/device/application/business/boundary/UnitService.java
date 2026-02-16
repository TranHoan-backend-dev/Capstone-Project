package com.capstone.device.application.business.boundary;

import com.capstone.device.application.dto.response.UnitResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UnitService {
  Page<UnitResponse> getPaginatedUnits(Pageable pageable, String filterName);
}
