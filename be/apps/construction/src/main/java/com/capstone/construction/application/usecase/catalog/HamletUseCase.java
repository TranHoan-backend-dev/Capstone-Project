package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.hamlet.HamletService;
import com.capstone.construction.application.dto.request.catalog.HamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
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
public class HamletUseCase {
  HamletService hamletService;

  public HamletResponse createHamlet(HamletRequest request) {
    log.info("UseCase: Creating hamlet {}", request.name());
    return hamletService.createHamlet(request);
  }

  public HamletResponse updateHamlet(String id, HamletRequest request) {
    log.info("UseCase: Updating hamlet {}", id);
    return hamletService.updateHamlet(id, request);
  }

  public void deleteHamlet(String id) {
    log.info("UseCase: Deleting hamlet {}", id);
    hamletService.deleteHamlet(id);
  }

  public HamletResponse getHamletById(String id) {
    log.info("UseCase: Fetching hamlet {}", id);
    return hamletService.getHamletById(id);
  }

  public PageResponse<HamletResponse> getAllHamlets(Pageable pageable) {
    log.info("UseCase: Fetching all hamlets");
    return hamletService.getAllHamlets(pageable);
  }
}
