package com.capstone.construction.application.business.road;

import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Road;
import com.capstone.construction.infrastructure.persistence.RoadRepository;
import com.capstone.construction.application.exception.ExistingItemException;
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
public class RoadServiceImpl implements RoadService {
  RoadRepository roadRepository;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public RoadResponse createRoad(@NonNull RoadRequest request) {
    log.info("Creating new road with name: {}", request.name());
    if (roadRepository.existsByName(request.name())) {
      throw new ExistingItemException("Road with name " + request.name() + " already exists");
    }

    var road = Road.create(builder -> builder
      .name(request.name()));

    var saved = roadRepository.save(road);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public RoadResponse updateRoad(String id, @NonNull RoadRequest request) {
    log.info("Updating road with id: {}", id);
    var road = roadRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Road not found with id: " + id));

    if (!road.getName().equals(request.name()) && roadRepository.existsByName(request.name())) {
      throw new ExistingItemException("Road with name " + request.name() + " already exists");
    }

    road.setName(request.name());

    var saved = roadRepository.save(road);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteRoad(String id) {
    log.info("Deleting road with id: {}", id);
    if (!roadRepository.existsById(id)) {
      throw new IllegalArgumentException("Road not found with id: " + id);
    }
    roadRepository.deleteById(id);
  }

  @Override
  public RoadResponse getRoadById(String id) {
    log.info("Fetching road with id: {}", id);
    return roadRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Road not found with id: " + id));
  }

  @Override
  public PageResponse<RoadResponse> getAllRoads(Pageable pageable) {
    log.info("Fetching all roads with pageable: {}", pageable);
    var page = roadRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private RoadResponse mapToResponse(@NonNull Road road) {
    return new RoadResponse(
      road.getRoadId(),
      road.getName(),
      road.getCreatedAt());
  }
}
