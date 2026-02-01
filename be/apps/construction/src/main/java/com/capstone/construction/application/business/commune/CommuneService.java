package com.capstone.construction.application.business.commune;

import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface CommuneService {
    CommuneResponse createCommune(CommuneRequest request);

    CommuneResponse updateCommune(String id, CommuneRequest request);

    void deleteCommune(String id);

    CommuneResponse getCommuneById(String id);

    PageResponse<CommuneResponse> getAllCommunes(Pageable pageable);
}
