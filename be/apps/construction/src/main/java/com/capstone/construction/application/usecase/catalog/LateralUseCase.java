package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.lateral.LateralService;
import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.dto.response.catalog.LateralResponse;
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
public class LateralUseCase {
    LateralService lateralService;

    public LateralResponse createLateral(LateralRequest request) {
        log.info("UseCase: Creating lateral {}", request.name());
        return lateralService.createLateral(request);
    }

    public LateralResponse updateLateral(String id, LateralRequest request) {
        log.info("UseCase: Updating lateral {}", id);
        return lateralService.updateLateral(id, request);
    }

    public void deleteLateral(String id) {
        log.info("UseCase: Deleting lateral {}", id);
        lateralService.deleteLateral(id);
    }

    public LateralResponse getLateralById(String id) {
        log.info("UseCase: Fetching lateral {}", id);
        return lateralService.getLateralById(id);
    }

    public PageResponse<LateralResponse> getAllLaterals(Pageable pageable) {
        log.info("UseCase: Fetching all laterals");
        return lateralService.getAllLaterals(pageable);
    }
}
