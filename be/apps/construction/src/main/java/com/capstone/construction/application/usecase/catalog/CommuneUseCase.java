package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.commune.CommuneService;
import com.capstone.construction.application.dto.request.catalog.CommuneRequest;
import com.capstone.construction.application.dto.response.catalog.CommuneResponse;
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
public class CommuneUseCase {
    CommuneService communeService;

    public CommuneResponse createCommune(CommuneRequest request) {
        log.info("UseCase: Creating commune {}", request.name());
        return communeService.createCommune(request);
    }

    public CommuneResponse updateCommune(String id, CommuneRequest request) {
        log.info("UseCase: Updating commune {}", id);
        return communeService.updateCommune(id, request);
    }

    public void deleteCommune(String id) {
        log.info("UseCase: Deleting commune {}", id);
        communeService.deleteCommune(id);
    }

    public CommuneResponse getCommuneById(String id) {
        log.info("UseCase: Fetching commune {}", id);
        return communeService.getCommuneById(id);
    }

    public PageResponse<CommuneResponse> getAllCommunes(Pageable pageable) {
        log.info("UseCase: Fetching all communes");
        return communeService.getAllCommunes(pageable);
    }
}
