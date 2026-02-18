package com.capstone.construction.application.business.roadmap;

import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Roadmap;
import com.capstone.construction.infrastructure.persistence.RoadmapRepository;
import com.capstone.construction.infrastructure.persistence.LateralRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
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
public class RoadmapServiceImpl implements RoadmapService {
  RoadmapRepository roadmapRepository;
  LateralRepository lateralRepository;
  WaterSupplyNetworkRepository networkRepository;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public RoadmapResponse createRoadmap(@NonNull RoadmapRequest request) {
    log.info("Creating new roadmap with name: {}", request.name());
    if (roadmapRepository.existsByName(request.name())) {
      throw new ExistingItemException("Roadmap with name " + request.name() + " already exists");
    }

    var lateral = lateralRepository.findById(request.lateralId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_74));

    var network = networkRepository.findById(request.networkId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_59));

    var roadmap = Roadmap.create(builder -> builder
      .name(request.name())
      .lateral(lateral)
      .network(network));

    var saved = roadmapRepository.save(roadmap);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public RoadmapResponse updateRoadmap(String id, @NonNull RoadmapRequest request) {
    log.info("Updating roadmap with id: {}", id);
    var roadmap = roadmapRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Roadmap not found with id: " + id));

    if (!roadmap.getName().equals(request.name()) && roadmapRepository.existsByName(request.name())) {
      throw new ExistingItemException("Roadmap with name " + request.name() + " already exists");
    }

    var lateral = lateralRepository.findById(request.lateralId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_74));

    var network = networkRepository.findById(request.networkId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_59));

    roadmap.setName(request.name());
    roadmap.setLateral(lateral);
    roadmap.setNetwork(network);

    var saved = roadmapRepository.save(roadmap);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteRoadmap(String id) {
    log.info("Deleting roadmap with id: {}", id);
    if (!roadmapRepository.existsById(id)) {
      throw new IllegalArgumentException("Roadmap not found with id: " + id);
    }
    roadmapRepository.deleteById(id);
  }

  @Override
  public RoadmapResponse getRoadmapById(String id) {
    log.info("Fetching roadmap with id: {}", id);
    return roadmapRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Roadmap not found with id: " + id));
  }

  @Override
  public PageResponse<RoadmapResponse> getAllRoadmaps(Pageable pageable) {
    log.info("Fetching all roadmaps with pageable: {}", pageable);
    var page = roadmapRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private RoadmapResponse mapToResponse(@NonNull Roadmap roadmap) {
    return new RoadmapResponse(
      roadmap.getRoadmapId(),
      roadmap.getName(),
      roadmap.getLateral().getId(),
      roadmap.getLateral().getName(),
      roadmap.getNetwork().getBranchId(),
      roadmap.getNetwork().getName(),
      roadmap.getCreatedAt());
  }
}
