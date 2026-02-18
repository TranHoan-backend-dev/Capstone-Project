package com.capstone.construction.application.business.unit;

import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.catalog.NeighborhoodUnitResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.NeighborhoodUnit;
import com.capstone.construction.infrastructure.persistence.NeighborhoodUnitRepository;
import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NeighborhoodUnitServiceImpl implements NeighborhoodUnitService {
  NeighborhoodUnitRepository unitRepository;
  CommuneRepository communeRepository;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public NeighborhoodUnitResponse createUnit(@NonNull NeighborhoodUnitRequest request) {
    log.info("Creating new neighborhood unit with name: {}", request.name());
    if (unitRepository.existsByName(request.name())) {
      throw new ExistingItemException("Neighborhood unit with name " + request.name() + " already exists");
    }

    var commune = communeRepository.findById(request.communeId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_26));

    var unit = NeighborhoodUnit.create(builder -> builder
      .name(request.name())
      .commune(commune));

    var saved = unitRepository.save(unit);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public NeighborhoodUnitResponse updateUnit(String id, @NonNull NeighborhoodUnitRequest request) {
    log.info("Updating neighborhood unit with id: {}", id);
    var unit = unitRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Neighborhood unit not found with id: " + id));

    if (!unit.getName().equals(request.name()) && unitRepository.existsByName(request.name())) {
      throw new ExistingItemException("Neighborhood unit with name " + request.name() + " already exists");
    }

    var commune = communeRepository.findById(request.communeId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_26));

    unit.setName(request.name());
    unit.setCommune(commune);

    var saved = unitRepository.save(unit);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteUnit(String id) {
    log.info("Deleting neighborhood unit with id: {}", id);
    if (!unitRepository.existsById(id)) {
      throw new IllegalArgumentException("Neighborhood unit not found with id: " + id);
    }
    unitRepository.deleteById(id);
  }

  @Override
  public NeighborhoodUnitResponse getUnitById(String id) {
    log.info("Fetching neighborhood unit with id: {}", id);
    return unitRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Neighborhood unit not found with id: " + id));
  }

  @Override
  public PageResponse<NeighborhoodUnitResponse> getAllUnits(Pageable pageable) {
    log.info("Fetching all neighborhood units with pageable: {}", pageable);
    var page = unitRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private NeighborhoodUnitResponse mapToResponse(@NonNull NeighborhoodUnit unit) {
    return new NeighborhoodUnitResponse(
      unit.getUnitId(),
      unit.getName(),
      unit.getCommune().getCommuneId(),
      unit.getCommune().getName(),
      unit.getCreatedAt());
  }
}
