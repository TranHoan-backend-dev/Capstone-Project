package com.capstone.construction.application.business.lateral;

import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.dto.response.catalog.LateralResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface LateralService {
    LateralResponse createLateral(LateralRequest request);

    LateralResponse updateLateral(String id, LateralRequest request);

    void deleteLateral(String id);

    LateralResponse getLateralById(String id);

    PageResponse<LateralResponse> getAllLaterals(Pageable pageable);
}
