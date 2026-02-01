package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.unit.NeighborhoodUnitService;
import com.capstone.construction.application.dto.request.catalog.NeighborhoodUnitRequest;
import com.capstone.construction.application.dto.response.catalog.NeighborhoodUnitResponse;
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
public class NeighborhoodUnitUseCase {
    NeighborhoodUnitService unitService;

    public NeighborhoodUnitResponse createUnit(NeighborhoodUnitRequest request) {
        log.info("UseCase: Creating unit {}", request.name());
        return unitService.createUnit(request);
    }

    public NeighborhoodUnitResponse updateUnit(String id, NeighborhoodUnitRequest request) {
        log.info("UseCase: Updating unit {}", id);
        return unitService.updateUnit(id, request);
    }

    public void deleteUnit(String id) {
        log.info("UseCase: Deleting unit {}", id);
        unitService.deleteUnit(id);
    }

    public NeighborhoodUnitResponse getUnitById(String id) {
        log.info("UseCase: Fetching unit {}", id);
        return unitService.getUnitById(id);
    }

    public PageResponse<NeighborhoodUnitResponse> getAllUnits(Pageable pageable) {
        log.info("UseCase: Fetching all units");
        return unitService.getAllUnits(pageable);
    }
}
