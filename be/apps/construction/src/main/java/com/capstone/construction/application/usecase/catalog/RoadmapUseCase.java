package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.roadmap.RoadmapService;
import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadmapUseCase {
  RoadmapService roadmapService;

  public RoadmapResponse createRoadmap(@NonNull RoadmapRequest request) {
    return roadmapService.createRoadmap(request);
  }

  public RoadmapResponse updateRoadmap(String id, RoadmapRequest request) {
    return roadmapService.updateRoadmap(id, request);
  }

  public void deleteRoadmap(String id) {
    roadmapService.deleteRoadmap(id);
  }

  public RoadmapResponse getRoadmapById(String id) {
    return roadmapService.getRoadmapById(id);
  }

  public PageResponse<RoadmapResponse> getAllRoadmaps(Pageable pageable) {
    return roadmapService.getAllRoadmaps(pageable);
  }
}
