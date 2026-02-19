package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.road.RoadService;
import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoadUseCase {
  RoadService roadService;

  public RoadResponse createRoad(RoadRequest request) {
    return roadService.createRoad(request);
  }

  public RoadResponse updateRoad(String id, RoadRequest request) {
    return roadService.updateRoad(id, request);
  }

  public void deleteRoad(String id) {
    roadService.deleteRoad(id);
  }

  public RoadResponse getRoadById(String id) {
    return roadService.getRoadById(id);
  }

  public PageResponse<RoadResponse> getAllRoads(Pageable pageable) {
    return roadService.getAllRoads(pageable);
  }
}
