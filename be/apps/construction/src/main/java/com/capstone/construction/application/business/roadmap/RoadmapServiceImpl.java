package com.capstone.construction.application.business.roadmap;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.enumerate.RoleName;
import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Roadmap;
import com.capstone.construction.infrastructure.persistence.RoadmapRepository;
import com.capstone.construction.infrastructure.persistence.LateralRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.service.EmployeeService;
import com.capstone.construction.infrastructure.utils.Message;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadmapServiceImpl implements RoadmapService {
  @NonFinal
  Logger log;
  RoadmapRepository roadmapRepository;
  LateralRepository lateralRepository;
  WaterSupplyNetworkRepository networkRepository;
  EmployeeService employeeService;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public RoadmapResponse createRoadmap(@NonNull RoadmapRequest request) {
    log.info("Creating new roadmap with name: {}", request.name());
    Objects.requireNonNull(request.name(), Message.PT_48);
    if (roadmapRepository.existsByNameEqualsIgnoreCase(request.name())) {
      throw new ExistingItemException("Roadmap with name " + request.name() + " already exists");
    }
    Objects.requireNonNull(request.lateralId(), Message.PT_49);
    Objects.requireNonNull(request.networkId(), Message.PT_34);

    var lateral = lateralRepository.findById(request.lateralId())
      .orElseThrow(() -> new IllegalArgumentException(Message.PT_54));

    var network = networkRepository.findById(request.networkId())
      .orElseThrow(() -> new IllegalArgumentException(Message.PT_55));

    // TODO: kiểm tra quy tắc định mã lộ trình ghi
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

    if (roadmapRepository.existsByNameEqualsIgnoreCase(request.name())) {
      throw new ExistingItemException("Roadmap with name " + request.name() + " already exists");
    }

    if (request.lateralId() != null && !request.lateralId().isBlank()) {
      var lateral = lateralRepository.findById(request.lateralId())
        .orElseThrow(() -> new IllegalArgumentException(Message.PT_54));
      roadmap.setLateral(lateral);
    }
    if (request.networkId() != null && !request.networkId().isBlank()) {
      var network = networkRepository.findById(request.networkId())
        .orElseThrow(() -> new IllegalArgumentException(Message.PT_55));
      roadmap.setNetwork(network);
    }
    if (request.name() != null && !request.name().isBlank()) {
      roadmap.setName(request.name());
    }

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

  public PageResponse<RoadmapResponse> getAllRoadmaps(Pageable pageable) {
    log.info("Fetching all roadmaps with pageable (no filters): {}", pageable);
    return getAllRoadmaps(pageable, null, null, null);
  }

  @Override
  public PageResponse<RoadmapResponse> getAllRoadmaps(Pageable pageable, String keyword, String lateralId, String networkId) {
    log.info("Fetching all roadmaps with filters - pageable: {}, keyword: {}, lateralId: {}, networkId: {}", pageable, keyword, lateralId, networkId);
    var page = roadmapRepository.searchRoadmaps(keyword, lateralId, networkId, pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private @NonNull RoadmapResponse mapToResponse(@NonNull Roadmap roadmap) {
    return new RoadmapResponse(
      roadmap.getRoadmapId(),
      roadmap.getName(),
      roadmap.getLateral().getId(),
      roadmap.getLateral().getName(),
      roadmap.getNetwork().getBranchId(),
      roadmap.getNetwork().getName(),
      roadmap.getCreatedAt(),
      roadmap.getAssignedStaffId());
  }

  @Override
  @Transactional
  public RoadmapResponse assignStaff(String roadmapId, String staffId) {
    log.info("Assigning staff with id: {}", staffId);
    var role = employeeService.getRoleOfEmployeeById(staffId).data().toString();
    if (!RoleName.METER_INSPECTION_STAFF.name().equalsIgnoreCase(role)) {
      throw new IllegalArgumentException("Phải gán cho nhân viên ghi thu");
    }

    var roadmap = roadmapRepository.findById(roadmapId)
      .orElseThrow(() -> new IllegalArgumentException("Roadmap not found"));
    roadmap.setAssignedStaffId(staffId);
    var saved = roadmapRepository.save(roadmap);

    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public RoadmapResponse cancelAssignment(String roadmapId) {
    var roadmap = roadmapRepository.findById(roadmapId)
      .orElseThrow(() -> new IllegalArgumentException("Roadmap not found"));
    roadmap.setAssignedStaffId(null);
    var saved = roadmapRepository.save(roadmap);

    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public RoadmapResponse updateAssignment(String roadmapId, String staffId) {
    var roadmap = roadmapRepository.findById(roadmapId)
      .orElseThrow(() -> new IllegalArgumentException("Roadmap not found"));
    roadmap.setAssignedStaffId(staffId);
    var saved = roadmapRepository.save(roadmap);

    return mapToResponse(saved);
  }

  @Override
  public boolean isExistingRoadmap(String id) {
    return roadmapRepository.existsById(id);
  }
}
