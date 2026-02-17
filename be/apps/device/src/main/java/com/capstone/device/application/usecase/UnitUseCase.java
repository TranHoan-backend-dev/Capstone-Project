package com.capstone.device.application.usecase;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.business.unit.UnitService;
import com.capstone.device.application.dto.response.UnitResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@AppLog
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UnitUseCase {
  UnitService unitService;

  @NonFinal
  Logger log;

  public Page<UnitResponse> getUnits(Pageable pageable, String filter) {
    log.info("Get units using filter: {}", filter);
    return unitService.getPaginatedUnits(pageable, filter);
  }
}
