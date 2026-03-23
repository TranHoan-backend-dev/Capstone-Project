package com.capstone.construction.application.business.roadmap;

import com.capstone.construction.application.dto.request.catalog.RoadmapRequest;
import com.capstone.construction.application.dto.response.catalog.RoadmapResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface RoadmapService {
  RoadmapResponse createRoadmap(RoadmapRequest request);

  RoadmapResponse updateRoadmap(String id, RoadmapRequest request);

  void deleteRoadmap(String id);

  RoadmapResponse getRoadmapById(String id);

  PageResponse<RoadmapResponse> getAllRoadmaps(Pageable pageable, String keyword, String lateralId, String networkId);

  RoadmapResponse assignStaff(String roadmapId, String staffId);

  RoadmapResponse cancelAssignment(String roadmapId);

  RoadmapResponse updateAssignment(String roadmapId, String staffId);

  boolean isExistingRoadmap(String id);
}
