package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.roadmap.RoadmapService;
import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadmapUseCase {
  RoadmapService roadmapService;

  public RoadmapResponse createRoadmap(RoadmapRequest request) {
    log.info("UseCase: Creating roadmap {}", request.name());
    return roadmapService.createRoadmap(request);
  }

  public RoadmapResponse updateRoadmap(String id, RoadmapRequest request) {
    log.info("UseCase: Updating roadmap {}", id);
    return roadmapService.updateRoadmap(id, request);
  }

  public void deleteRoadmap(String id) {
    log.info("UseCase: Deleting roadmap {}", id);
    roadmapService.deleteRoadmap(id);
  }

  public RoadmapResponse getRoadmapById(String id) {
    log.info("UseCase: Fetching roadmap {}", id);
    return roadmapService.getRoadmapById(id);
  }

  public PageResponse<RoadmapResponse> getAllRoadmaps(Pageable pageable) {
    log.info("UseCase: Fetching all roadmaps");
    return roadmapService.getAllRoadmaps(pageable);
  }
}
