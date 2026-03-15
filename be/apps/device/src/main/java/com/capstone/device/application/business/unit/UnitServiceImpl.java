package com.capstone.device.application.business.unit;

import com.capstone.common.annotation.AppLog;
import com.capstone.device.application.dto.request.unit.CreateUnitRequest;
import com.capstone.device.application.dto.request.UpdateUnitRequest;
import com.capstone.device.application.dto.response.UnitResponse;
import com.capstone.device.domain.model.Unit;
import com.capstone.device.infrastructure.persistence.MaterialRepository;
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
import org.springframework.transaction.annotation.Transactional;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UnitServiceImpl implements UnitService {
  UnitRepository unitRepository;
  MaterialRepository materialRepository;

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

  @Override
  @Transactional
  public UnitResponse createUnit(CreateUnitRequest request) {
    log.info("Creating new unit: {}", request.name());
    if (unitRepository.existsByNameIgnoreCase(request.name())) {
      throw new IllegalArgumentException("Đơn vị đo '" + request.name() + "' đã tồn tại");
    }
    var unit = Unit.create(builder -> builder.name(request.name()));
    var savedUnit = unitRepository.save(unit);
    return convertUnitToResponse(savedUnit);
  }

  @Override
  @Transactional
  public UnitResponse updateUnit(String id, @NonNull UpdateUnitRequest request) {
    log.info("Updating unit id: {} with name: {}", id, request.name());
    var unit = unitRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị đo với ID: " + id));

    if (unitRepository.existsByNameIgnoreCaseAndIdNot(request.name(), id)) {
      throw new IllegalArgumentException("Đơn vị đo '" + request.name() + "' đã tồn tại");
    }

    unit.setName(request.name());
    var savedUnit = unitRepository.save(unit);

    return convertUnitToResponse(savedUnit);
  }

  @Override
  public UnitResponse getUnitById(String id) {
    log.info("Fetching unit with id: {}", id);
    var unit = unitRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị đo với ID: " + id));
    return convertUnitToResponse(unit);
  }

  @Override
  @Transactional
  public void deleteUnit(String id) {
    log.info("Deleting unit id: {}", id);
    var unit = unitRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn vị đo với ID: " + id));

    if (materialRepository.existsByUnit_Id(id)) {
      throw new IllegalArgumentException("Không thể xóa đơn vị đo vì đang được sử dụng bởi vật tư");
    }

    unitRepository.delete(unit);
  }

  private UnitResponse convertUnitToResponse(@NonNull Unit unit) {
    return new UnitResponse(
        unit.getId(),
        unit.getName(),
        unit.getCreatedAt().toLocalDate().toString(),
        unit.getUpdatedAt().toLocalDate().toString());
  }
}
