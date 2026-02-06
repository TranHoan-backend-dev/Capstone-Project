package com.capstone.construction.application.business.road;

import com.capstone.construction.application.dto.request.catalog.RoadRequest;
import com.capstone.construction.application.dto.response.catalog.RoadResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface RoadService {
    RoadResponse createRoad(RoadRequest request);

    RoadResponse updateRoad(String id, RoadRequest request);

    void deleteRoad(String id);

    RoadResponse getRoadById(String id);

    PageResponse<RoadResponse> getAllRoads(Pageable pageable);
}
