package com.capstone.construction.application.business.hamlet;

import com.capstone.construction.application.dto.request.catalog.HamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface HamletService {
    HamletResponse createHamlet(HamletRequest request);

    HamletResponse updateHamlet(String id, HamletRequest request);

    void deleteHamlet(String id);

    HamletResponse getHamletById(String id);

    PageResponse<HamletResponse> getAllHamlets(Pageable pageable);
}
