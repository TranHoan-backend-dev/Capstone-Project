package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.road.RoadService;
import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
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
public class RoadUseCase {
  RoadService roadService;

  public RoadResponse createRoad(RoadRequest request) {
    log.info("UseCase: Creating road {}", request.name());
    return roadService.createRoad(request);
  }

  public RoadResponse updateRoad(String id, RoadRequest request) {
    log.info("UseCase: Updating road {}", id);
    return roadService.updateRoad(id, request);
  }

  public void deleteRoad(String id) {
    log.info("UseCase: Deleting road {}", id);
    roadService.deleteRoad(id);
  }

  public RoadResponse getRoadById(String id) {
    log.info("UseCase: Fetching road {}", id);
    return roadService.getRoadById(id);
  }

  public PageResponse<RoadResponse> getAllRoads(Pageable pageable) {
    log.info("UseCase: Fetching all roads");
    return roadService.getAllRoads(pageable);
  }
}
