package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.lateral.LateralService;
import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.dto.response.catalog.LateralResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LateralUseCase {
  LateralService lateralService;

  public LateralResponse createLateral(LateralRequest request) {
    return lateralService.createLateral(request);
  }

  public LateralResponse updateLateral(String id, LateralRequest request) {
    return lateralService.updateLateral(id, request);
  }

  public void deleteLateral(String id) {
    lateralService.deleteLateral(id);
  }

  public LateralResponse getLateralById(String id) {
    return lateralService.getLateralById(id);
  }

  public PageResponse<LateralResponse> getAllLaterals(Pageable pageable) {
    return lateralService.getAllLaterals(pageable);
  }
}
