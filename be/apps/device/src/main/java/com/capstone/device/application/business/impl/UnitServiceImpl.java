package com.capstone.device.application.business.impl;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.utils.IdEncoder;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.domain.model.Unit;
import com.capstone.device.infrastructure.persistence.UnitRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.capstone.device.application.business.boundary.UnitService;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UnitServiceImpl implements UnitService {
  UnitRepository unitRepository;

  @NonFinal
  Logger log;

  @Override
  public Page<UnitResponse> getPaginatedUnits(Pageable pageable, String filterName) {
    log.info("getPaginatedUnits");
    var result = filterName == null ? unitRepository.findAll(pageable)
        : unitRepository.findByNameContainsIgnoreCase(filterName, pageable);
    var content = result.getContent();
    var response = content.stream().map(this::convertUnitToResponse).toList();
    return new PageImpl<>(response, pageable, result.getTotalElements());
  }

  private UnitResponse convertUnitToResponse(@NonNull Unit unit) {
    return new UnitResponse(
        IdEncoder.encode(unit.getId()),
        unit.getName(),
        unit.getCreatedAt().toLocalDate().toString(),
        unit.getUpdatedAt().toLocalDate().toString());
  }
}
